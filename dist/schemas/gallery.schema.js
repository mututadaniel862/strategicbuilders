import { z } from 'zod';
export const gallerySchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(150),
    description: z.string().max(500).optional(),
    category: z.enum(['renovation', 'construction', 'design', 'other']).default('other'),
    isFeatured: z.boolean().default(false),
    adminPhone: z.string().min(6, 'Phone number is required'),
    adminEmail: z.string().email('Invalid admin email'),
    // ADD THESE TWO FIELDS - they were missing!
    beforeImage: z.string().optional(), // Optional because might come from files
    afterImage: z.string().optional(), // Optional because might come from files
});
export const galleryUpdateSchema = gallerySchema.partial();
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
