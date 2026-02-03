import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import type { AdminLoginData, AdminUpdateData } from '../../schemas/admin.schema.js';
import { logAction } from '../middleware/logging.js';

export class AdminService {
  // Initialize first admin (run this once)
  static async initializeAdmin() {
    try {
      // Check if any admin exists
      const existingAdmin = await prisma.admin.findFirst();
      
      if (existingAdmin) {
        console.log('Admin already exists. Skipping initialization.');
        return null;
      }

      // Create the first admin
      const hashedPassword = await bcrypt.hash('ChiKukw@stra', 10);
      
      const admin = await prisma.admin.create({
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
    } catch (error: any) {
      console.error('Error initializing admin:', error.message);
      throw error;
    }
  }

  // Admin login
  static async login(loginData: AdminLoginData, ipAddress?: string) {
    const { email, password } = loginData;

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      await logAction('failed_login_attempt', { email, ipAddress }, 'public');
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      await logAction('failed_login_attempt', { email, ipAddress }, 'public');
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    await logAction('admin_login', { adminId: admin.id, ipAddress }, 'admin');

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
  static async createAdmin(creatorAdminId: number, adminData: {
    email: string;
    phone?: string;
    password: string;
    role?: string;
  }) {
    // Check if creator admin exists
    const creatorAdmin = await prisma.admin.findUnique({
      where: { id: creatorAdminId }
    });

    if (!creatorAdmin) {
      throw new Error('Unauthorized');
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      throw new Error('An admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create new admin
    const newAdmin = await prisma.admin.create({
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

    await logAction('admin_created', { 
      creatorAdminId, 
      newAdminId: newAdmin.id,
      newAdminEmail: newAdmin.email 
    }, 'admin');

    return newAdmin;
  }

  // Get all admins
  static async getAllAdmins(requestingAdminId: number) {
    const requestingAdmin = await prisma.admin.findUnique({
      where: { id: requestingAdminId }
    });

    if (!requestingAdmin) {
      throw new Error('Unauthorized');
    }

    const admins = await prisma.admin.findMany({
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
  static async deleteAdmin(requestingAdminId: number, adminIdToDelete: number) {
    // Can't delete yourself
    if (requestingAdminId === adminIdToDelete) {
      throw new Error('You cannot delete your own account');
    }

    const requestingAdmin = await prisma.admin.findUnique({
      where: { id: requestingAdminId }
    });

    if (!requestingAdmin) {
      throw new Error('Unauthorized');
    }

    const adminToDelete = await prisma.admin.findUnique({
      where: { id: adminIdToDelete }
    });

    if (!adminToDelete) {
      throw new Error('Admin not found');
    }

    await prisma.admin.delete({
      where: { id: adminIdToDelete }
    });

    await logAction('admin_deleted', { 
      deletedBy: requestingAdminId,
      deletedAdminId: adminIdToDelete,
      deletedAdminEmail: adminToDelete.email
    }, 'admin');

    return { message: 'Admin deleted successfully' };
  }

  // Get admin profile
  static async getProfile(adminId: number) {
    const admin = await prisma.admin.findUnique({
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
  static async updateProfile(adminId: number, updateData: AdminUpdateData) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const updatePayload: any = {};
    
    if (updateData.email) updatePayload.email = updateData.email;
    if (updateData.phone) updatePayload.phone = updateData.phone;
    
    if (updateData.newPassword && updateData.currentPassword) {
      const isValidPassword = await bcrypt.compare(updateData.currentPassword, admin.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }
      updatePayload.password = await bcrypt.hash(updateData.newPassword, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: updatePayload,
      select: {
        id: true,
        email: true,
        phone: true,
        role: true
      }
    });

    await logAction('admin_profile_update', { adminId }, 'admin');

    return updatedAdmin;
  }

  // Get dashboard statistics
  static async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalBlogs,
      totalGallery,
      totalReviews,
      totalMessages,
      todayLogs,
      unreadMessages,
      pendingReviews
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.gallery.count(),
      prisma.review.count(),
      prisma.message.count(),
      prisma.log.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      }),
      prisma.message.count({
        where: {
          isRead: false
        }
      }),
      prisma.review.count({
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

