"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_js_1 = require("../controllers/contact.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const validate_js_1 = require("../middleware/validate.js");
const contact_schema_js_1 = require("../../schemas/contact.schema.js");
const router = (0, express_1.Router)();
// Public routes
router.post('/', (0, validate_js_1.validate)(contact_schema_js_1.contactSchema), contact_controller_js_1.ContactController.submitContact);
// Admin routes
router.get('/', auth_js_1.adminAuth, contact_controller_js_1.ContactController.getAllMessages);
router.get('/stats', auth_js_1.adminAuth, contact_controller_js_1.ContactController.getMessageStats);
router.get('/:id', auth_js_1.adminAuth, contact_controller_js_1.ContactController.getMessage);
router.put('/:id', auth_js_1.adminAuth, contact_controller_js_1.ContactController.updateMessage);
router.delete('/:id', auth_js_1.adminAuth, contact_controller_js_1.ContactController.deleteMessage);
exports.default = router;
