import type { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import type { AuthRequest } from '../middleware/auth.js';

export class AdminController {
  // Initialize first admin (call this once)
  static async initialize(req: Request, res: Response) {
    try {
      const result = await AdminService.initializeAdmin();
      
      if (!result) {
        res.json({
          success: false,
          message: 'Admin already initialized'
        });
      } else {
        res.json({
          success: true,
          message: 'First admin created successfully',
          admin: {
            email: result.email,
            role: result.role
          }
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Admin login
  static async login(req: Request, res: Response) {
    try {
      const result = await AdminService.login(req.body, req.ip);
      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  // Create new admin
  static async createAdmin(req: AuthRequest, res: Response) {
    try {
      const { email, phone, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters'
        });
      }

      const newAdmin = await AdminService.createAdmin(req.admin!.id, {
        email,
        phone,
        password,
        role
      });

      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        admin: newAdmin
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get all admins
  static async getAllAdmins(req: AuthRequest, res: Response) {
    try {
      const admins = await AdminService.getAllAdmins(req.admin!.id);
      res.json({
        success: true,
        admins
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Delete admin
  static async deleteAdmin(req: AuthRequest, res: Response) {
    try {
      const adminId = parseInt(req.params.id);
      
      if (isNaN(adminId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid admin ID'
        });
      }

      const result = await AdminService.deleteAdmin(req.admin!.id, adminId);
      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get admin profile
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const admin = await AdminService.getProfile(req.admin!.id);
      res.json({
        success: true,
        admin
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update admin profile
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const updatedAdmin = await AdminService.updateProfile(req.admin!.id, req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully',
        admin: updatedAdmin
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get dashboard stats
  static async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json({
        success: true,
        stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to get dashboard statistics'
      });
    }
  }
}