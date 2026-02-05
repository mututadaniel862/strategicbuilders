import { z } from 'zod';

// Preprocessor to handle FormData string values
const preprocessBoolean = z.preprocess((val) => {
  if (typeof val === 'string') {
    return val === 'true';
  }
  return val;
}, z.boolean());

export const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  excerpt: z.string().max(300).optional().default(''),
  category: z.string().default('General'),
  isPublished: preprocessBoolean.default(true),
  featuredImage: z.string().optional()
});

export const blogUpdateSchema = blogSchema.partial();

export type BlogData = z.infer<typeof blogSchema>;
export type BlogUpdateData = z.infer<typeof blogUpdateSchema>;










// import { z } from 'zod';

// export const blogSchema = z.object({
//   title: z.string().min(5, 'Title must be at least 5 characters').max(200),
//   content: z.string().min(50, 'Content must be at least 50 characters'),
//   excerpt: z.string().max(300).optional(),
//   category: z.string().default('General'),
//   isPublished: z.boolean().default(true),
//    featuredImage: z.string().optional() 
// });

// export const blogUpdateSchema = blogSchema.partial();

// export type BlogData = z.infer<typeof blogSchema>;
// export type BlogUpdateData = z.infer<typeof blogUpdateSchema>;