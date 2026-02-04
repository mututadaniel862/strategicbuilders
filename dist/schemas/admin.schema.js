"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateSchema = exports.adminLoginSchema = void 0;
const zod_1 = require("zod");
exports.adminLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.adminUpdateSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email').optional(),
    phone: zod_1.z.string().optional(),
    currentPassword: zod_1.z.string().optional(),
    newPassword: zod_1.z.string().min(6, 'New password must be at least 6 characters').optional(),
}).refine((data) => {
    if (data.newPassword && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Current password is required when setting a new password",
    path: ["currentPassword"],
});
