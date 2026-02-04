"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_js_1 = require("../controllers/blog.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const validate_js_1 = require("../middleware/validate.js");
const blog_schema_js_1 = require("../../schemas/blog.schema.js");
const cloudinary_js_1 = require("../config/cloudinary.js");
const router = (0, express_1.Router)();
// Public routes
router.get('/', blog_controller_js_1.BlogController.getAllBlogs);
router.get('/categories', blog_controller_js_1.BlogController.getCategories);
router.get('/:id', blog_controller_js_1.BlogController.getBlog);
// Admin routes
router.post('/', auth_js_1.adminAuth, 
// Make multer optional - only run for form-data
(req, res, next) => {
    if (req.is('multipart/form-data')) {
        cloudinary_js_1.uploadBlogImage.single('featuredImage')(req, res, next);
    }
    else {
        next();
    }
}, (0, validate_js_1.validate)(blog_schema_js_1.blogSchema), blog_controller_js_1.BlogController.createBlog);
router.put('/:id', auth_js_1.adminAuth, (req, res, next) => {
    if (req.is('multipart/form-data')) {
        cloudinary_js_1.uploadBlogImage.single('featuredImage')(req, res, next);
    }
    else {
        next();
    }
}, (0, validate_js_1.validate)(blog_schema_js_1.blogUpdateSchema), blog_controller_js_1.BlogController.updateBlog);
router.delete('/:id', auth_js_1.adminAuth, blog_controller_js_1.BlogController.deleteBlog);
exports.default = router;
