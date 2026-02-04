"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_js_1 = require("../services/admin.service.js");
class AdminController {
    // Initialize first admin (call this once)
    static async initialize(req, res) {
        try {
            const result = await admin_service_js_1.AdminService.initializeAdmin();
            if (!result) {
                res.json({
                    success: false,
                    message: 'Admin already initialized'
                });
            }
            else {
                res.json({
                    success: true,
                    message: 'First admin created successfully',
                    admin: {
                        email: result.email,
                        role: result.role
                    }
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    // Admin login
    static async login(req, res) {
        try {
            const result = await admin_service_js_1.AdminService.login(req.body, req.ip);
            res.json({
                success: true,
                ...result
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                error: error.message
            });
        }
    }
    // Create new admin
    static async createAdmin(req, res) {
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
            const newAdmin = await admin_service_js_1.AdminService.createAdmin(req.admin.id, {
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
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    // Get all admins
    static async getAllAdmins(req, res) {
        try {
            const admins = await admin_service_js_1.AdminService.getAllAdmins(req.admin.id);
            res.json({
                success: true,
                admins
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    // Delete admin
    static async deleteAdmin(req, res) {
        try {
            // const adminId = parseInt(req.params.id);
            const adminId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            if (isNaN(adminId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid admin ID'
                });
            }
            const result = await admin_service_js_1.AdminService.deleteAdmin(req.admin.id, adminId);
            res.json({
                success: true,
                ...result
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    // Get admin profile
    static async getProfile(req, res) {
        try {
            const admin = await admin_service_js_1.AdminService.getProfile(req.admin.id);
            res.json({
                success: true,
                admin
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
    // Update admin profile
    static async updateProfile(req, res) {
        try {
            const updatedAdmin = await admin_service_js_1.AdminService.updateProfile(req.admin.id, req.body);
            res.json({
                success: true,
                message: 'Profile updated successfully',
                admin: updatedAdmin
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    // Get dashboard stats
    static async getDashboardStats(req, res) {
        try {
            const stats = await admin_service_js_1.AdminService.getDashboardStats();
            res.json({
                success: true,
                stats
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to get dashboard statistics'
            });
        }
    }
}
exports.AdminController = AdminController;
