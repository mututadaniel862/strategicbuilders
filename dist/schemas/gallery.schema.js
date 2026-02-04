"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryUpdateSchema = exports.gallerySchema = void 0;
const zod_1 = require("zod");
exports.gallerySchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(150),
    description: zod_1.z.string().max(500).optional(),
    category: zod_1.z.enum(['renovation', 'construction', 'design', 'other']).default('other'),
    isFeatured: zod_1.z.boolean().default(false),
    adminPhone: zod_1.z.string().min(6, 'Phone number is required'),
    adminEmail: zod_1.z.string().email('Invalid admin email'),
    // ADD THESE TWO FIELDS - they were missing!
    beforeImage: zod_1.z.string().optional(), // Optional because might come from files
    afterImage: zod_1.z.string().optional(), // Optional because might come from files
});
exports.galleryUpdateSchema = exports.gallerySchema.partial();
// import { z } from 'zod';
// export const gallerySchema = z.object({
//   title: z.string().min(3, 'Title must be at least 3 characters').max(150),
//   description: z.string().max(500).optional(),
//   category: z.enum(['renovation', 'construction', 'design', 'other']).default('other'),
//   isFeatured: z.boolean().default(false),
//   adminPhone: z.string().min(6, 'Phone number is required'),
//   adminEmail: z.string().email('Invalid admin email'),
// });
// export const galleryUpdateSchema = gallerySchema.partial();
// export type GalleryData = z.infer<typeof gallerySchema>;
// export type GalleryUpdateData = z.infer<typeof galleryUpdateSchema>;
