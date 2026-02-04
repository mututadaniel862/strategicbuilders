import prisma from '../config/database.js';
import { sendContactEmailToAdmin } from '../config/mailer.js';
export class ContactService {
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
        const message = await prisma.message.create({
            data: contactData // Just pass the contact data directly
        });
        // Send email to admin
        try {
            await sendContactEmailToAdmin(contactData.name, contactData.email, contactData.message, contactData.phone);
        }
        catch (error) {
            console.error('Failed to send email notification:', error);
        }
        await prisma.log.create({
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
            prisma.message.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.message.count({ where: whereClause })
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
        const message = await prisma.message.findUnique({
            where: { id }
        });
        if (!message) {
            throw new Error('Message not found');
        }
        // Mark as read when admin views it
        if (!message.isRead) {
            await prisma.message.update({
                where: { id },
                data: { isRead: true }
            });
        }
        return message;
    }
    // Admin: Update message
    static async updateMessage(id, updateData) {
        const message = await prisma.message.findUnique({
            where: { id }
        });
        if (!message) {
            throw new Error('Message not found');
        }
        const updatedMessage = await prisma.message.update({
            where: { id },
            data: updateData
        });
        await prisma.log.create({
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
        const message = await prisma.message.findUnique({
            where: { id }
        });
        if (!message) {
            throw new Error('Message not found');
        }
        await prisma.message.delete({
            where: { id }
        });
        await prisma.log.create({
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
            prisma.message.count(),
            prisma.message.count({ where: { isRead: false } }),
            prisma.message.count({ where: { isResolved: true } }),
            prisma.message.count({
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
