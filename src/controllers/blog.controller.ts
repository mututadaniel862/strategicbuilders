import type { Request, Response } from 'express';
import { BlogService } from '../services/blog.service.js';

export class BlogController {
  // Get all blogs (public)
  static async getAllBlogs(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, category } = req.query;
      
      const result = await BlogService.getAllBlogs(
        Number(page),
        Number(limit),
        search as string,
        category as string
      );
      
      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch blogs'
      });
    }
  }

  // Get single blog
  static async getBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      let blog;
      if (!isNaN(Number(id))) {
        blog = await BlogService.getBlogById(Number(id));
      } else {
        blog = await BlogService.getBlogBySlug(id);
      }
      
      res.json({
        success: true,
        blog
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  // Create blog (admin) - UPDATED TO ACCEPT FILES OR JSON
  static async createBlog(req: Request, res: Response) {
    try {
      console.log('📥 Body:', req.body);
      console.log('📁 File:', req.file);

      let featuredImage: string | undefined;

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
      
      const blog = await BlogService.createBlog(blogData, (req as any).admin.id);
      
      res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        blog
      });
    } catch (error: any) {
      console.error('❌ Error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update blog (admin)
  static async updateBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      let featuredImage: string | undefined;

      if (req.file) {
        featuredImage = req.file.path;
      } else if (req.body.featuredImage) {
        featuredImage = req.body.featuredImage;
      }

      const updateData = {
        ...req.body,
        ...(featuredImage && { featuredImage })
      };
      
      const blog = await BlogService.updateBlog(Number(id), updateData);
      
      res.json({
        success: true,
        message: 'Blog updated successfully',
        blog
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Delete blog (admin)
  static async deleteBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await BlogService.deleteBlog(Number(id));
      
      res.json({
        success: true,
        message: 'Blog deleted successfully'
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get blog categories
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await BlogService.getBlogCategories();
      
      res.json({
        success: true,
        categories
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories'
      });
    }
  }
}