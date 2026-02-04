"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const database_js_1 = __importDefault(require("../config/database.js"));
class GalleryService {
    // Get all gallery items
    static async getAllGalleryItems(category, featured) {
        const whereClause = {};
        if (category && category !== 'all') {
            whereClause.category = category;
        }
        if (featured) {
            whereClause.isFeatured = true;
        }
        const galleryItems = await database_js_1.default.gallery.findMany({
            where: whereClause,
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ],
            select: {
                id: true,
                title: true,
                beforeImage: true,
                afterImage: true,
                description: true,
                category: true,
                isFeatured: true,
                adminPhone: true,
                adminEmail: true,
                createdAt: true
            }
        });
        return galleryItems;
    }
    // Get single gallery item
    static async getGalleryItemById(id) {
        const galleryItem = await database_js_1.default.gallery.findUnique({
            where: { id }
        });
        if (!galleryItem) {
            throw new Error('Gallery item not found');
        }
        return galleryItem;
    }
    // Create gallery item
    static async createGalleryItem(galleryData, adminId) {
        const gallery = await database_js_1.default.gallery.create({
            data: {
                ...galleryData,
                adminPhone: process.env.ADMIN_PHONE,
                adminEmail: process.env.ADMIN_EMAIL
            }
        });
        await database_js_1.default.log.create({
            data: {
                action: 'gallery_created',
                details: { galleryId: gallery.id, title: gallery.title },
                userType: 'admin',
                endpoint: 'POST /gallery'
            }
        });
        return gallery;
    }
    // Update gallery item
    static async updateGalleryItem(id, updateData) {
        const gallery = await database_js_1.default.gallery.findUnique({
            where: { id }
        });
        if (!gallery) {
            throw new Error('Gallery item not found');
        }
        const updatedGallery = await database_js_1.default.gallery.update({
            where: { id },
            data: updateData
        });
        await database_js_1.default.log.create({
            data: {
                action: 'gallery_updated',
                details: { galleryId: id, title: updatedGallery.title },
                userType: 'admin',
                endpoint: 'PUT /gallery/:id'
            }
        });
        return updatedGallery;
    }
    // Delete gallery item
    static async deleteGalleryItem(id) {
        const gallery = await database_js_1.default.gallery.findUnique({
            where: { id }
        });
        if (!gallery) {
            throw new Error('Gallery item not found');
        }
        await database_js_1.default.gallery.delete({
            where: { id }
        });
        await database_js_1.default.log.create({
            data: {
                action: 'gallery_deleted',
                details: { galleryId: id, title: gallery.title },
                userType: 'admin',
                endpoint: 'DELETE /gallery/:id'
            }
        });
        return { message: 'Gallery item deleted successfully' };
    }
    // Get gallery categories
    static async getGalleryCategories() {
        const categories = await database_js_1.default.gallery.findMany({
            select: {
                category: true
            },
            distinct: ['category']
        });
        return categories.map(cat => cat.category);
    }
    // Get contact info for hover
    static async getGalleryContactInfo() {
        return {
            adminPhone: process.env.ADMIN_PHONE,
            adminEmail: process.env.ADMIN_EMAIL,
            whatsapp: `https://wa.me/${process.env.ADMIN_PHONE?.replace('+', '')}`,
            callLink: `tel:${process.env.ADMIN_PHONE}`
        };
    }
}
exports.GalleryService = GalleryService;
