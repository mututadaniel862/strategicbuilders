"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogUpdateSchema = exports.blogSchema = void 0;
const zod_1 = require("zod");
// Preprocessor to handle FormData string values
const preprocessBoolean = zod_1.z.preprocess((val) => {
    if (typeof val === 'string') {
        return val === 'true';
    }
    return val;
}, zod_1.z.boolean());
exports.blogSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Title must be at least 5 characters').max(200),
    content: zod_1.z.string().min(50, 'Content must be at least 50 characters'),
    excerpt: zod_1.z.string().max(300).optional().default(''),
    category: zod_1.z.string().default('General'),
    isPublished: preprocessBoolean.default(true),
    featuredImage: zod_1.z.string().optional()
});
exports.blogUpdateSchema = exports.blogSchema.partial();
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
