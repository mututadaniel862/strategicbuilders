import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller.js';
import { adminAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { blogSchema, blogUpdateSchema } from '../../schemas/blog.schema.js';
import { uploadBlogImage } from '../config/cloudinary.js';
const router = Router();
// Public routes
router.get('/', BlogController.getAllBlogs);
router.get('/categories', BlogController.getCategories);
router.get('/:id', BlogController.getBlog);
// Admin routes
router.post('/', adminAuth, 
// Make multer optional - only run for form-data
(req, res, next) => {
    if (req.is('multipart/form-data')) {
        uploadBlogImage.single('featuredImage')(req, res, next);
    }
    else {
        next();
    }
}, validate(blogSchema), BlogController.createBlog);
router.put('/:id', adminAuth, (req, res, next) => {
    if (req.is('multipart/form-data')) {
        uploadBlogImage.single('featuredImage')(req, res, next);
    }
    else {
        next();
    }
}, validate(blogUpdateSchema), BlogController.updateBlog);
router.delete('/:id', adminAuth, BlogController.deleteBlog);
export default router;
//# sourceMappingURL=blog.routes.js.map