"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gallery_controller_js_1 = require("../controllers/gallery.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const validate_js_1 = require("../middleware/validate.js");
const gallery_schema_js_1 = require("../../schemas/gallery.schema.js");
const cloudinary_js_1 = require("../config/cloudinary.js");
const router = (0, express_1.Router)();
// Public routes
router.get('/', gallery_controller_js_1.GalleryController.getAllGallery);
router.get('/categories', gallery_controller_js_1.GalleryController.getCategories);
router.get('/contact-info', gallery_controller_js_1.GalleryController.getContactInfo);
router.get('/:id', gallery_controller_js_1.GalleryController.getGalleryItem);
// Admin routes
router.post('/', auth_js_1.adminAuth, 
// Make multer optional - it will only process if Content-Type is multipart/form-data
(req, res, next) => {
    if (req.is('multipart/form-data')) {
        cloudinary_js_1.uploadGalleryImage.array('images', 2)(req, res, next);
    }
    else {
        next();
    }
}, (0, validate_js_1.validate)(gallery_schema_js_1.gallerySchema), gallery_controller_js_1.GalleryController.createGalleryItem);
router.put('/:id', auth_js_1.adminAuth, (req, res, next) => {
    if (req.is('multipart/form-data')) {
        cloudinary_js_1.uploadGalleryImage.array('images', 2)(req, res, next);
    }
    else {
        next();
    }
}, (0, validate_js_1.validate)(gallery_schema_js_1.galleryUpdateSchema), gallery_controller_js_1.GalleryController.updateGalleryItem);
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
