import { Router } from 'express';
import { GalleryController } from '../controllers/gallery.controller.js';
import { adminAuth } from '../middleware/auth.js';
import { validateFormData } from '../middleware/validate.js';
import { gallerySchema, galleryUpdateSchema } from '../../schemas/gallery.schema.js';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store in memory for cloudinary upload
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public routes
router.get('/', GalleryController.getAllGallery);
router.get('/categories', GalleryController.getCategories);
router.get('/contact', GalleryController.getContactInfo);
router.get('/:id', GalleryController.getGalleryItem);

// Admin routes - WITH VALIDATION for form fields + file checking
router.post(
  '/', 
  adminAuth, 
  upload.array('images', 2), // Accept up to 2 images with field name 'images'
  validateFormData(gallerySchema, true), // Validate form fields + require 2 files
  GalleryController.createGalleryItem
);

router.put(
  '/:id', 
  adminAuth, 
  upload.array('images', 2),
  validateFormData(galleryUpdateSchema, false), // Validate form fields, files optional for update
  GalleryController.updateGalleryItem
);

router.delete('/:id', adminAuth, GalleryController.deleteGalleryItem);

export default router;














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