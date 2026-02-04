import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller.js';
import { adminAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { contactSchema } from '../../schemas/contact.schema.js';
const router = Router();
// Public routes
router.post('/', validate(contactSchema), ContactController.submitContact);
// Admin routes
router.get('/', adminAuth, ContactController.getAllMessages);
router.get('/stats', adminAuth, ContactController.getMessageStats);
router.get('/:id', adminAuth, ContactController.getMessage);
router.put('/:id', adminAuth, ContactController.updateMessage);
router.delete('/:id', adminAuth, ContactController.deleteMessage);
export default router;
