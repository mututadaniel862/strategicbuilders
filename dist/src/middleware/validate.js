"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
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
