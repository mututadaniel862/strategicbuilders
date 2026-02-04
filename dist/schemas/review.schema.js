"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const zod_1 = require("zod");
exports.reviewSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: zod_1.z.string().email('Invalid email address').optional().or(zod_1.z.literal('')),
    rating: zod_1.z.number().min(1).max(5).default(5),
    comment: zod_1.z.string().min(10, 'Comment must be at least 10 characters').max(1000),
});
