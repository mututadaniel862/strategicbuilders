"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogUpdateSchema = exports.blogSchema = void 0;
const zod_1 = require("zod");
exports.blogSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Title must be at least 5 characters').max(200),
    content: zod_1.z.string().min(50, 'Content must be at least 50 characters'),
    excerpt: zod_1.z.string().max(300).optional(),
    category: zod_1.z.string().default('General'),
    isPublished: zod_1.z.boolean().default(true),
    featuredImage: zod_1.z.string().optional()
});
exports.blogUpdateSchema = exports.blogSchema.partial();
