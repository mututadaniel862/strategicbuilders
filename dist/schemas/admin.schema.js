import { z } from 'zod';
export const adminLoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
export const adminUpdateSchema = z.object({
    email: z.string().email('Invalid email').optional(),
    phone: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
}).refine((data) => {
    if (data.newPassword && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Current password is required when setting a new password",
    path: ["currentPassword"],
});
//# sourceMappingURL=admin.schema.js.map