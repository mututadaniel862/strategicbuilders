import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

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