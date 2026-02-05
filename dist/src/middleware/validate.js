"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFormData = exports.validate = void 0;
// Regular validation for JSON requests
const validate = (schema) => (req, res, next) => {
    try {
        // Parse only the request body directly, not wrapped in an object
        const validatedData = schema.parse(req.body);
        // Replace req.body with validated data
        req.body = validatedData;
        next();
    }
    catch (error) {
        const errors = error.errors?.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
        })) || [{ message: 'Validation error' }];
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors,
        });
    }
};
exports.validate = validate;
// Validation for FormData requests (with file uploads)
const validateFormData = (schema, requireFiles = false) => (req, res, next) => {
    try {
        // Validate the body fields (not files)
        const validatedData = schema.parse(req.body);
        // Check if files are required and present
        if (requireFiles && (!req.files || req.files.length < 2)) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: [{ field: 'images', message: 'Two images are required' }]
            });
        }
        req.body = validatedData;
        next();
    }
    catch (error) {
        const errors = error.errors?.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
        })) || [{ message: 'Validation error' }];
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors,
        });
    }
};
exports.validateFormData = validateFormData;
// import type { Request, Response, NextFunction } from 'express';
// import type { ZodSchema } from 'zod';
// export const validate =
//   (schema: ZodSchema) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Parse only the request body directly, not wrapped in an object
//       const validatedData = schema.parse(req.body);
//       // Replace req.body with validated data
//       req.body = validatedData;
//       next();
//     } catch (error: any) {
//       const errors =
//         error.errors?.map((err: any) => ({
//           field: err.path.join('.'),
//           message: err.message,
//         })) || [{ message: 'Validation error' }];
//       res.status(400).json({
//         success: false,
//         error: 'Validation failed',
//         details: errors,
//       });
//     }
//   };
