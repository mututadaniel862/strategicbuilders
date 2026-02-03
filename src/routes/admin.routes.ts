import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { adminAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { adminLoginSchema, adminUpdateSchema } from '../../schemas/admin.schema.js';

const router = Router();

// Initialize first admin (call this once to create the first admin)
router.post('/initialize', AdminController.initialize);

// Public routes
router.post('/login', validate(adminLoginSchema), AdminController.login);

// Protected routes (admin only)
router.get('/profile', adminAuth, AdminController.getProfile);
router.put('/profile', adminAuth, validate(adminUpdateSchema), AdminController.updateProfile);
router.get('/dashboard', adminAuth, AdminController.getDashboardStats);

// Admin management routes (admin only)
router.post('/create', adminAuth, AdminController.createAdmin);
router.get('/all', adminAuth, AdminController.getAllAdmins);
router.delete('/:id', adminAuth, AdminController.deleteAdmin);

export default router;