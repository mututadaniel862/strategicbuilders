"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const database_js_1 = __importDefault(require("../config/database.js"));
const mailer_js_1 = require("../config/mailer.js");
class ContactService {
    // Submit contact form
    // static async submitContactForm(
    //   contactData: ContactFormData,
    //   ipAddress?: string
    // ) {
    //   // Create message in database
    //   const message = await prisma.message.create({
    //     data: {
    //       ...contactData,
    //       ipAddress
    //     }
    //   });
    //   // Send email to admin
    //   try {
    //     await sendContactEmailToAdmin(
    //       contactData.name,
    //       contactData.email,
    //       contactData.message,
    //       contactData.phone
    //     );
    //   } catch (error) {
    //     console.error('Failed to send email notification:', error);
    //     // Continue even if email fails
    //   }
    //   await prisma.log.create({
    //     data: {
    //       action: 'contact_form_submitted',
    //       details: { messageId: message.id, name: message.name },
    //       userType: 'public',
    //       endpoint: 'POST /contact'
    //     }
    //   });
    //   return {
    //     message: 'Contact form submitted successfully',
    //     data: {
    //       id: message.id,
    //       name: message.name,
    //       email: message.email
    //     }
    //   };
    // }
    // Submit contact form
    static async submitContactForm(contactData) {
        // Create message in database
        const message = await database_js_1.default.message.create({
            data: contactData // Just pass the contact data directly
        });
        // Send email to admin
        try {
            await (0, mailer_js_1.sendContactEmailToAdmin)(contactData.name, contactData.email, contactData.message, contactData.phone);
        }
        catch (error) {
            console.error('Failed to send email notification:', error);
        }
        await database_js_1.default.log.create({
            data: {
                action: 'contact_form_submitted',
                details: { messageId: message.id, name: message.name },
                userType: 'public',
                endpoint: 'POST /contact'
            }
        });
        return {
            message: 'Contact form submitted successfully',
            data: {
                id: message.id,
                name: message.name,
                email: message.email
            }
        };
    }
    // Admin: Get all messages
    static async getAllMessages(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (filters?.isRead !== undefined) {
            whereClause.isRead = filters.isRead;
        }
        if (filters?.isResolved !== undefined) {
            whereClause.isResolved = filters.isResolved;
        }
        if (filters?.search) {
            whereClause.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
                { subject: { contains: filters.search, mode: 'insensitive' } },
                { message: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        const [messages, total] = await Promise.all([
            database_js_1.default.message.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            database_js_1.default.message.count({ where: whereClause })
        ]);
        return {
            messages,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    }
    // Admin: Get single message
    static async getMessageById(id) {
        const message = await database_js_1.default.message.findUnique({
            where: { id }
        });
        if (!message) {
            throw new Error('Message not found');
        }
        // Mark as read when admin views it
        if (!message.isRead) {
            await database_js_1.default.message.update({
                where: { id },
                data: { isRead: true }
            });
        }
        return message;
    }
    // Admin: Update message
    static async updateMessage(id, updateData) {
        const message = await database_js_1.default.message.findUnique({
            where: { id }
        });
        if (!message) {
            throw new Error('Message not found');
        }
        const updatedMessage = await database_js_1.default.message.update({
            where: { id },
            data: updateData
        });
        await database_js_1.default.log.create({
            data: {
                action: 'message_updated',
                details: { messageId: id, name: message.name },
                userType: 'admin',
                endpoint: 'PUT /contact/:id'
            }
        });
        return updatedMessage;
    }
    // Admin: Delete message
    static async deleteMessage(id) {
        const message = await database_js_1.default.message.findUnique({
            where: { id }
        });
        if (!message) {
            throw new Error('Message not found');
        }
        await database_js_1.default.message.delete({
            where: { id }
        });
        await database_js_1.default.log.create({
            data: {
                action: 'message_deleted',
                details: { messageId: id, name: message.name },
                userType: 'admin',
                endpoint: 'DELETE /contact/:id'
            }
        });
        return { message: 'Contact message deleted successfully' };
    }
    // Get message statistics
    static async getMessageStats() {
        const [total, unread, resolved, todayCount] = await Promise.all([
            database_js_1.default.message.count(),
            database_js_1.default.message.count({ where: { isRead: false } }),
            database_js_1.default.message.count({ where: { isResolved: true } }),
            database_js_1.default.message.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            })
        ]);
        return {
            total,
            unread,
            resolved,
            todayCount
        };
    }
}
exports.ContactService = ContactService;
