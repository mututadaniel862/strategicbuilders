import { Router } from 'express';
import { GalleryController } from '../controllers/gallery.controller.js';
import { adminAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { gallerySchema, galleryUpdateSchema } from '../../schemas/gallery.schema.js';
import { uploadGalleryImage } from '../config/cloudinary.js';

const router = Router();

// Public routes
router.get('/', GalleryController.getAllGallery);
router.get('/categories', GalleryController.getCategories);
router.get('/contact-info', GalleryController.getContactInfo);
router.get('/:id', GalleryController.getGalleryItem);

// Admin routes
router.post(
  '/',
  adminAuth,
  // Make multer optional - it will only process if Content-Type is multipart/form-data
  (req, res, next) => {
    if (req.is('multipart/form-data')) {
      uploadGalleryImage.array('images', 2)(req, res, next);
    } else {
      next();
    }
  },
  validate(gallerySchema),
  GalleryController.createGalleryItem
);

router.put(
  '/:id',
  adminAuth,
  (req, res, next) => {
    if (req.is('multipart/form-data')) {
      uploadGalleryImage.array('images', 2)(req, res, next);
    } else {
      next();
    }
  },
  validate(galleryUpdateSchema),
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