"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_js_1 = require("../controllers/admin.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const validate_js_1 = require("../middleware/validate.js");
const admin_schema_js_1 = require("../../schemas/admin.schema.js");
const router = (0, express_1.Router)();
// Initialize first admin (call this once to create the first admin)
router.post('/initialize', admin_controller_js_1.AdminController.initialize);
// Public routes
router.post('/login', (0, validate_js_1.validate)(admin_schema_js_1.adminLoginSchema), admin_controller_js_1.AdminController.login);
// Protected routes (admin only)
router.get('/profile', auth_js_1.adminAuth, admin_controller_js_1.AdminController.getProfile);
router.put('/profile', auth_js_1.adminAuth, (0, validate_js_1.validate)(admin_schema_js_1.adminUpdateSchema), admin_controller_js_1.AdminController.updateProfile);
router.get('/dashboard', auth_js_1.adminAuth, admin_controller_js_1.AdminController.getDashboardStats);
// Admin management routes (admin only)
router.post('/create', auth_js_1.adminAuth, admin_controller_js_1.AdminController.createAdmin);
router.get('/all', auth_js_1.adminAuth, admin_controller_js_1.AdminController.getAllAdmins);
router.delete('/:id', auth_js_1.adminAuth, admin_controller_js_1.AdminController.deleteAdmin);
exports.default = router;
