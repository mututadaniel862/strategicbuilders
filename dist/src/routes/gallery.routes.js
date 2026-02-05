"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gallery_controller_js_1 = require("../controllers/gallery.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const validate_js_1 = require("../middleware/validate.js");
const gallery_schema_js_1 = require("../../schemas/gallery.schema.js");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.memoryStorage(); // Store in memory for cloudinary upload
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
// Public routes
router.get('/', gallery_controller_js_1.GalleryController.getAllGallery);
router.get('/categories', gallery_controller_js_1.GalleryController.getCategories);
router.get('/contact', gallery_controller_js_1.GalleryController.getContactInfo);
router.get('/:id', gallery_controller_js_1.GalleryController.getGalleryItem);
// Admin routes - WITH VALIDATION for form fields + file checking
router.post('/', auth_js_1.adminAuth, upload.array('images', 2), // Accept up to 2 images with field name 'images'
(0, validate_js_1.validateFormData)(gallery_schema_js_1.gallerySchema, true), // Validate form fields + require 2 files
gallery_controller_js_1.GalleryController.createGalleryItem);
router.put('/:id', auth_js_1.adminAuth, upload.array('images', 2), (0, validate_js_1.validateFormData)(gallery_schema_js_1.galleryUpdateSchema, false), // Validate form fields, files optional for update
gallery_controller_js_1.GalleryController.updateGalleryItem);
router.delete('/:id', auth_js_1.adminAuth, gallery_controller_js_1.GalleryController.deleteGalleryItem);
exports.default = router;
// import { Router } from 'express';
// import { GalleryController } from '../controllers/gallery.controller.js';
// import { adminAuth } from '../middleware/auth.js';
// import { validate } from '../middleware/validate.js';
// import { gallerySchema, galleryUpdateSchema } from '../../schemas/gallery.schema.js';
// import { uploadGalleryImage } from '../config/cloudinary.js';
// const router = Router();
// // Public routes
// router.get('/', GalleryController.getAllGallery);
// router.get('/categories', GalleryController.getCategories);
// router.get('/contact-info', GalleryController.getContactInfo);
// router.get('/:id', GalleryController.getGalleryItem);
// // Admin routes
// router.post(
//   '/',
//   adminAuth,
//   // Make multer optional - it will only process if Content-Type is multipart/form-data
//   (req, res, next) => {
//     if (req.is('multipart/form-data')) {
//       uploadGalleryImage.array('images', 2)(req, res, next);
//     } else {
//       next();
//     }
//   },
//   validate(gallerySchema),
//   GalleryController.createGalleryItem
// );
// router.put(
//   '/:id',
//   adminAuth,
//   (req, res, next) => {
//     if (req.is('multipart/form-data')) {
//       uploadGalleryImage.array('images', 2)(req, res, next);
//     } else {
//       next();
//     }
//   },
//   validate(galleryUpdateSchema),
//   GalleryController.updateGalleryItem
// );
// router.delete('/:id', adminAuth, GalleryController.deleteGalleryItem);
// export default router;
// import { Router } from 'express';
// import { GalleryController } from '../controllers/gallery.controller.js';
// import { adminAuth } from '../middleware/auth.js';
// import { validate } from '../middleware/validate.js';
// import { gallerySchema, galleryUpdateSchema } from '../../schemas/gallery.schema.js';
// import { uploadGalleryImage } from '../config/cloudinary.js';
// const router = Router();
// // Public routes
// router.get('/', GalleryController.getAllGallery);
// router.get('/categories', GalleryController.getCategories);
// router.get('/contact-info', GalleryController.getContactInfo);
// router.get('/:id', GalleryController.getGalleryItem);
// // Admin routes
// router.post(
//   '/',
//   adminAuth,
//   uploadGalleryImage.array('images', 2),
//   validate(gallerySchema),
//   GalleryController.createGalleryItem
// );
// router.put(
//   '/:id',
//   adminAuth,
//   uploadGalleryImage.array('images', 2),
//   validate(galleryUpdateSchema),
//   GalleryController.updateGalleryItem
// );
// router.delete('/:id', adminAuth, GalleryController.deleteGalleryItem);
// export default router;
