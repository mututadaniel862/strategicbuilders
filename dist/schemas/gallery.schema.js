"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryUpdateSchema = exports.gallerySchema = void 0;
const zod_1 = require("zod");
// Schema for validating form fields (without images - they come as files)
exports.gallerySchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(150),
    description: zod_1.z.string().max(500).optional(),
    category: zod_1.z.enum(['renovation', 'construction', 'design', 'other']).default('other'),
    isFeatured: zod_1.z.union([zod_1.z.boolean(), zod_1.z.string()]).transform(val => val === true || val === 'true').default(false),
    adminPhone: zod_1.z.string().min(6, 'Phone number is required'),
    adminEmail: zod_1.z.string().email('Invalid admin email'),
    // Images are optional in the schema because they come as files in req.files
    beforeImage: zod_1.z.string().optional(),
    afterImage: zod_1.z.string().optional(),
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
//   // ADD THESE TWO FIELDS - they were missing!
//   beforeImage: z.string().optional(), // Optional because might come from files
//   afterImage: z.string().optional(),  // Optional because might come from files
// });
// export const galleryUpdateSchema = gallerySchema.partial();
// export type GalleryData = z.infer<typeof gallerySchema>;
// export type GalleryUpdateData = z.infer<typeof galleryUpdateSchema>;
