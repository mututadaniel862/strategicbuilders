"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSchema = void 0;
const zod_1 = require("zod");
exports.contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: zod_1.z.string().email('Invalid email address'),
    phone: zod_1.z.string().optional(),
    subject: zod_1.z.string().max(200).optional(),
    message: zod_1.z.string().min(10, 'Message must be at least 10 characters').max(5000),
});
