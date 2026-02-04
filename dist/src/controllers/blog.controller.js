"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const blog_service_js_1 = require("../services/blog.service.js");
class BlogController {
    // Get all blogs (public)
    static async getAllBlogs(req, res) {
        try {
            const { page = 1, limit = 10, search, category } = req.query;
            const result = await blog_service_js_1.BlogService.getAllBlogs(Number(page), Number(limit), search, category);
            res.json({
                success: true,
                ...result
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch blogs'
            });
        }
    }
    // Get single blog
    static async getBlog(req, res) {
        try {
            const { id } = req.params;
            let blog;
            if (!isNaN(Number(id))) {
                blog = await blog_service_js_1.BlogService.getBlogById(Number(id));
            }
            else {
                // blog = await BlogService.getBlogBySlug(id);
                const slug = Array.isArray(id) ? id[0] : id;
                blog = await blog_service_js_1.BlogService.getBlogBySlug(slug);
            }
            res.json({
                success: true,
                blog
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
    // Create blog (admin) - UPDATED TO ACCEPT FILES OR JSON
    static async createBlog(req, res) {
        try {
            console.log('📥 Body:', req.body);
            console.log('📁 File:', req.file);
            let featuredImage;
            // Option 1: File uploaded via form-data
            if (req.file) {
                console.log('✅ Using uploaded file');
                featuredImage = req.file.path;
            }
            // Option 2: Base64 string sent via JSON
            else if (req.body.featuredImage) {
                console.log('✅ Using base64 image from JSON');
                featuredImage = req.body.featuredImage;
            }
            const blogData = {
                title: req.body.title,
                content: req.body.content,
                excerpt: req.body.excerpt,
                category: req.body.category,
                isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
                featuredImage
            };
            console.log('📦 Blog data:', blogData);
            // const blog = await BlogService.createBlog(blogData, (req as any).admin.id);
            const blog = await blog_service_js_1.BlogService.createBlog({ ...blogData, featuredImage: blogData.featuredImage || "" }, // default empty string
            req.admin.id);
            res.status(201).json({
                success: true,
                message: 'Blog created successfully',
                blog
            });
        }
        catch (error) {
            console.error('❌ Error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    // Update blog (admin)
    static async updateBlog(req, res) {
        try {
            const { id } = req.params;
            let featuredImage;
            if (req.file) {
                featuredImage = req.file.path;
            }
            else if (req.body.featuredImage) {
                featuredImage = req.body.featuredImage;
            }
            const updateData = {
                ...req.body,
                ...(featuredImage && { featuredImage })
            };
            const blog = await blog_service_js_1.BlogService.updateBlog(Number(id), updateData);
            res.json({
                success: true,
                message: 'Blog updated successfully',
                blog
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    // Delete blog (admin)
    static async deleteBlog(req, res) {
        try {
            const { id } = req.params;
            await blog_service_js_1.BlogService.deleteBlog(Number(id));
            res.json({
                success: true,
                message: 'Blog deleted successfully'
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
    // Get blog categories
    static async getCategories(req, res) {
        try {
            const categories = await blog_service_js_1.BlogService.getBlogCategories();
            res.json({
                success: true,
                categories
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch categories'
            });
        }
    }
}
exports.BlogController = BlogController;
