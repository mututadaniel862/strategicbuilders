"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const gallery_service_js_1 = require("../services/gallery.service.js");
class GalleryController {
    // Get all gallery items (public)
    static async getAllGallery(req, res) {
        try {
            const { category, featured } = req.query;
            const galleryItems = await gallery_service_js_1.GalleryService.getAllGalleryItems(category, featured === 'true');
            res.json({
                success: true,
                gallery: galleryItems
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch gallery items'
            });
        }
    }
    // Get single gallery item
    static async getGalleryItem(req, res) {
        try {
            const { id } = req.params;
            const galleryItem = await gallery_service_js_1.GalleryService.getGalleryItemById(Number(id));
            res.json({
                success: true,
                galleryItem
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
    // Create gallery item (admin) - WITH EXTENSIVE DEBUGGING
    static async createGalleryItem(req, res) {
        try {
            // EXTENSIVE LOGGING
            console.log('\n========== GALLERY CREATE REQUEST ==========');
            console.log('📥 req.body:', JSON.stringify(req.body, null, 2));
            console.log('📁 req.files:', req.files);
            console.log('🔍 req.body.beforeImage exists?', !!req.body.beforeImage);
            console.log('🔍 req.body.afterImage exists?', !!req.body.afterImage);
            console.log('🔍 typeof req.body:', typeof req.body);
            console.log('🔍 Object.keys(req.body):', Object.keys(req.body));
            console.log('==========================================\n');
            let beforeImage;
            let afterImage;
            // Option 1: Files uploaded via form-data
            if (req.files && Array.isArray(req.files) && req.files.length >= 2) {
                console.log('✅ Using uploaded files');
                beforeImage = req.files[0].path;
                afterImage = req.files[1].path;
            }
            // Option 2: Base64 strings sent via JSON
            else if (req.body.beforeImage && req.body.afterImage) {
                console.log('✅ Using base64 images from JSON');
                beforeImage = req.body.beforeImage;
                afterImage = req.body.afterImage;
            }
            // Neither option provided
            else {
                console.log('❌ No images found in request');
                console.log('Debug info:');
                console.log('  - req.files:', req.files);
                console.log('  - req.body.beforeImage:', req.body.beforeImage?.substring(0, 50));
                console.log('  - req.body.afterImage:', req.body.afterImage?.substring(0, 50));
                return res.status(400).json({
                    success: false,
                    error: 'Both before and after images are required (upload files or send base64)',
                    debug: {
                        hasFiles: !!req.files,
                        hasBeforeImage: !!req.body.beforeImage,
                        hasAfterImage: !!req.body.afterImage,
                        bodyKeys: Object.keys(req.body)
                    }
                });
            }
            const galleryData = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
                adminPhone: req.body.adminPhone,
                adminEmail: req.body.adminEmail,
                beforeImage,
                afterImage
            };
            console.log('📦 Gallery data prepared:', {
                ...galleryData,
                beforeImage: galleryData.beforeImage.substring(0, 50) + '...',
                afterImage: galleryData.afterImage.substring(0, 50) + '...'
            });
            const galleryItem = await gallery_service_js_1.GalleryService.createGalleryItem(galleryData, req.admin.id);
            res.status(201).json({
                success: true,
                message: 'Gallery item created successfully',
                galleryItem
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
    // Update gallery item (admin)
    static async updateGalleryItem(req, res) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };
            // Handle file uploads
            if (req.files && Array.isArray(req.files)) {
                if (req.files[0])
                    updateData.beforeImage = req.files[0].path;
                if (req.files[1])
                    updateData.afterImage = req.files[1].path;
            }
            const galleryItem = await gallery_service_js_1.GalleryService.updateGalleryItem(Number(id), updateData);
            res.json({
                success: true,
                message: 'Gallery item updated successfully',
                galleryItem
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    // Delete gallery item (admin)
    static async deleteGalleryItem(req, res) {
        try {
            const { id } = req.params;
            await gallery_service_js_1.GalleryService.deleteGalleryItem(Number(id));
            res.json({
                success: true,
                message: 'Gallery item deleted successfully'
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
    // Get gallery categories
    static async getCategories(req, res) {
        try {
            const categories = await gallery_service_js_1.GalleryService.getGalleryCategories();
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
    // Get contact info for hover
    static async getContactInfo(req, res) {
        try {
            const contactInfo = await gallery_service_js_1.GalleryService.getGalleryContactInfo();
            res.json({
                success: true,
                ...contactInfo
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch contact information'
            });
        }
    }
}
exports.GalleryController = GalleryController;
// import type { Request, Response } from 'express';
// import { GalleryService } from '../services/gallery.service.js';
// export class GalleryController {
//   // Get all gallery items (public)
//   static async getAllGallery(req: Request, res: Response) {
//     try {
//       const { category, featured } = req.query;
//       const galleryItems = await GalleryService.getAllGalleryItems(
//         category as string,
//         featured === 'true'
//       );
//       res.json({
//         success: true,
//         gallery: galleryItems
//       });
//     } catch (error: any) {
//       res.status(500).json({
//         success: false,
//         error: 'Failed to fetch gallery items'
//       });
//     }
//   }
//   // Get single gallery item
//   static async getGalleryItem(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const galleryItem = await GalleryService.getGalleryItemById(Number(id));
//       res.json({
//         success: true,
//         galleryItem
//       });
//     } catch (error: any) {
//       res.status(404).json({
//         success: false,
//         error: error.message
//       });
//     }
//   }
//   // Create gallery item (admin)
//   static async createGalleryItem(req: Request, res: Response) {
//     try {
//       if (!req.files || !Array.isArray(req.files) || req.files.length < 2) {
//         return res.status(400).json({
//           success: false,
//           error: 'Both before and after images are required'
//         });
//       }
//       const galleryData = {
//         ...req.body,
//         beforeImage: req.files[0].path,
//         afterImage: req.files[1].path
//       };
//       const galleryItem = await GalleryService.createGalleryItem(
//         galleryData,
//         (req as any).admin.id
//       );
//       res.status(201).json({
//         success: true,
//         message: 'Gallery item created successfully',
//         galleryItem
//       });
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         error: error.message
//       });
//     }
//   }
//   // Update gallery item (admin)
//   static async updateGalleryItem(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const updateData: any = { ...req.body };
//       if (req.files) {
//         const files = req.files as Express.Multer.File[];
//         if (files[0]) updateData.beforeImage = files[0].path;
//         if (files[1]) updateData.afterImage = files[1].path;
//       }
//       const galleryItem = await GalleryService.updateGalleryItem(Number(id), updateData);
//       res.json({
//         success: true,
//         message: 'Gallery item updated successfully',
//         galleryItem
//       });
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         error: error.message
//       });
//     }
//   }
//   // Delete gallery item (admin)
//   static async deleteGalleryItem(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       await GalleryService.deleteGalleryItem(Number(id));
//       res.json({
//         success: true,
//         message: 'Gallery item deleted successfully'
//       });
//     } catch (error: any) {
//       res.status(404).json({
//         success: false,
//         error: error.message
//       });
//     }
//   }
//   // Get gallery categories
//   static async getCategories(req: Request, res: Response) {
//     try {
//       const categories = await GalleryService.getGalleryCategories();
//       res.json({
//         success: true,
//         categories
//       });
//     } catch (error: any) {
//       res.status(500).json({
//         success: false,
//         error: 'Failed to fetch categories'
//       });
//     }
//   }
//   // Get contact info for hover
//   static async getContactInfo(req: Request, res: Response) {
//     try {
//       const contactInfo = await GalleryService.getGalleryContactInfo();
//       res.json({
//         success: true,
//         ...contactInfo
//       });
//     } catch (error: any) {
//       res.status(500).json({
//         success: false,
//         error: 'Failed to fetch contact information'
//       });
//     }
//   }
// }
