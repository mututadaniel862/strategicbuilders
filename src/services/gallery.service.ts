import prisma from '../config/database.js';
import type { GalleryData, GalleryUpdateData } from '../../schemas/gallery.schema.js';

export class GalleryService {
  // Get all gallery items
  static async getAllGalleryItems(category?: string, featured?: boolean) {
    const whereClause: any = {};

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (featured) {
      whereClause.isFeatured = true;
    }

    const galleryItems = await prisma.gallery.findMany({
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
  static async getGalleryItemById(id: number) {
    const galleryItem = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!galleryItem) {
      throw new Error('Gallery item not found');
    }

    return galleryItem;
  }

  // Create gallery item
  static async createGalleryItem(
    galleryData: GalleryData & { beforeImage: string; afterImage: string },
    adminId: number
  ) {
    const gallery = await prisma.gallery.create({
      data: {
        ...galleryData,
        adminPhone: process.env.ADMIN_PHONE!,
        adminEmail: process.env.ADMIN_EMAIL!
      }
    });

    await prisma.log.create({
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
  static async updateGalleryItem(
    id: number,
    updateData: GalleryUpdateData & { beforeImage?: string; afterImage?: string }
  ) {
    const gallery = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!gallery) {
      throw new Error('Gallery item not found');
    }

    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: updateData
    });

    await prisma.log.create({
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
  static async deleteGalleryItem(id: number) {
    const gallery = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!gallery) {
      throw new Error('Gallery item not found');
    }

    await prisma.gallery.delete({
      where: { id }
    });

    await prisma.log.create({
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
    const categories = await prisma.gallery.findMany({
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