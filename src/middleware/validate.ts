import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

// Regular validation for JSON requests
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse only the request body directly, not wrapped in an object
      const validatedData = schema.parse(req.body);
      
      // Replace req.body with validated data
      req.body = validatedData;
      
      next();
    } catch (error: any) {
      const errors =
        error.errors?.map((err: any) => ({
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

// Validation for FormData requests (with file uploads)
export const validateFormData =
  (schema: ZodSchema, requireFiles: boolean = false) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the body fields (not files)
      const validatedData = schema.parse(req.body);
      
      // Check if files are required and present
      if (requireFiles && (!req.files || (req.files as any[]).length < 2)) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: [{ field: 'images', message: 'Two images are required' }]
        });
      }
      
      req.body = validatedData;
      next();
    } catch (error: any) {
      const errors =
        error.errors?.map((err: any) => ({
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