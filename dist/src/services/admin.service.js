"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_js_1 = __importDefault(require("../config/database.js"));
const logging_js_1 = require("../middleware/logging.js");
class AdminService {
    // Initialize first admin (run this once)
    static async initializeAdmin() {
        try {
            // Check if any admin exists
            const existingAdmin = await database_js_1.default.admin.findFirst();
            if (existingAdmin) {
                console.log('Admin already exists. Skipping initialization.');
                return null;
            }
            // Create the first admin
            const hashedPassword = await bcryptjs_1.default.hash('ChiKukw@stra', 10);
            const admin = await database_js_1.default.admin.create({
                data: {
                    email: 'stategicbuilderss@gmail.com',
                    password: hashedPassword,
                    phone: '', // Empty phone or you can set a default
                    role: 'super_admin'
                }
            });
            console.log('First admin created successfully!');
            console.log('Email: stategicbuilderss@gmail.com');
            console.log('Password: ChiKukw@stra');
            return admin;
        }
        catch (error) {
            console.error('Error initializing admin:', error.message);
            throw error;
        }
    }
    // Admin login
    static async login(loginData, ipAddress) {
        const { email, password } = loginData;
        const admin = await database_js_1.default.admin.findUnique({
            where: { email }
        });
        if (!admin) {
            await (0, logging_js_1.logAction)('failed_login_attempt', { email, ipAddress }, 'public');
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            await (0, logging_js_1.logAction)('failed_login_attempt', { email, ipAddress }, 'public');
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        await (0, logging_js_1.logAction)('admin_login', { adminId: admin.id, ipAddress }, 'admin');
        return {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                phone: admin.phone,
                role: admin.role
            }
        };
    }
    // Create new admin (only existing admins can do this)
    static async createAdmin(creatorAdminId, adminData) {
        // Check if creator admin exists
        const creatorAdmin = await database_js_1.default.admin.findUnique({
            where: { id: creatorAdminId }
        });
        if (!creatorAdmin) {
            throw new Error('Unauthorized');
        }
        // Check if email already exists
        const existingAdmin = await database_js_1.default.admin.findUnique({
            where: { email: adminData.email }
        });
        if (existingAdmin) {
            throw new Error('An admin with this email already exists');
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(adminData.password, 10);
        // Create new admin
        const newAdmin = await database_js_1.default.admin.create({
            data: {
                email: adminData.email,
                phone: adminData.phone || '', // Use provided phone or empty string
                password: hashedPassword,
                role: adminData.role || 'admin'
            },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });
        await (0, logging_js_1.logAction)('admin_created', {
            creatorAdminId,
            newAdminId: newAdmin.id,
            newAdminEmail: newAdmin.email
        }, 'admin');
        return newAdmin;
    }
    // Get all admins
    static async getAllAdmins(requestingAdminId) {
        const requestingAdmin = await database_js_1.default.admin.findUnique({
            where: { id: requestingAdminId }
        });
        if (!requestingAdmin) {
            throw new Error('Unauthorized');
        }
        const admins = await database_js_1.default.admin.findMany({
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return admins;
    }
    // Delete admin
    static async deleteAdmin(requestingAdminId, adminIdToDelete) {
        // Can't delete yourself
        if (requestingAdminId === adminIdToDelete) {
            throw new Error('You cannot delete your own account');
        }
        const requestingAdmin = await database_js_1.default.admin.findUnique({
            where: { id: requestingAdminId }
        });
        if (!requestingAdmin) {
            throw new Error('Unauthorized');
        }
        const adminToDelete = await database_js_1.default.admin.findUnique({
            where: { id: adminIdToDelete }
        });
        if (!adminToDelete) {
            throw new Error('Admin not found');
        }
        await database_js_1.default.admin.delete({
            where: { id: adminIdToDelete }
        });
        await (0, logging_js_1.logAction)('admin_deleted', {
            deletedBy: requestingAdminId,
            deletedAdminId: adminIdToDelete,
            deletedAdminEmail: adminToDelete.email
        }, 'admin');
        return { message: 'Admin deleted successfully' };
    }
    // Get admin profile
    static async getProfile(adminId) {
        const admin = await database_js_1.default.admin.findUnique({
            where: { id: adminId },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });
        if (!admin) {
            throw new Error('Admin not found');
        }
        return admin;
    }
    // Update admin profile
    static async updateProfile(adminId, updateData) {
        const admin = await database_js_1.default.admin.findUnique({
            where: { id: adminId }
        });
        if (!admin) {
            throw new Error('Admin not found');
        }
        const updatePayload = {};
        if (updateData.email)
            updatePayload.email = updateData.email;
        if (updateData.phone)
            updatePayload.phone = updateData.phone;
        if (updateData.newPassword && updateData.currentPassword) {
            const isValidPassword = await bcryptjs_1.default.compare(updateData.currentPassword, admin.password);
            if (!isValidPassword) {
                throw new Error('Current password is incorrect');
            }
            updatePayload.password = await bcryptjs_1.default.hash(updateData.newPassword, 10);
        }
        const updatedAdmin = await database_js_1.default.admin.update({
            where: { id: adminId },
            data: updatePayload,
            select: {
                id: true,
                email: true,
                phone: true,
                role: true
            }
        });
        await (0, logging_js_1.logAction)('admin_profile_update', { adminId }, 'admin');
        return updatedAdmin;
    }
    // Get dashboard statistics
    static async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalBlogs, totalGallery, totalReviews, totalMessages, todayLogs, unreadMessages, pendingReviews] = await Promise.all([
            database_js_1.default.blog.count(),
            database_js_1.default.gallery.count(),
            database_js_1.default.review.count(),
            database_js_1.default.message.count(),
            database_js_1.default.log.count({
                where: {
                    createdAt: {
                        gte: today
                    }
                }
            }),
            database_js_1.default.message.count({
                where: {
                    isRead: false
                }
            }),
            database_js_1.default.review.count({
                where: {
                    isApproved: false
                }
            })
        ]);
        return {
            blogs: totalBlogs,
            gallery: totalGallery,
            reviews: totalReviews,
            messages: totalMessages,
            todayLogs,
            unreadMessages,
            pendingReviews
        };
    }
}
exports.AdminService = AdminService;
