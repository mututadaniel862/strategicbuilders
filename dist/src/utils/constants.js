"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE_MESSAGES = exports.GALLERY_CATEGORIES = exports.BLOG_CATEGORIES = exports.PAGINATION = exports.UPLOAD_LIMITS = exports.RATE_LIMIT = exports.APP_VERSION = exports.APP_NAME = void 0;
// Constants
exports.APP_NAME = "Website Backend";
exports.APP_VERSION = "1.0.0";
// API Rate limiting
exports.RATE_LIMIT = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
};
// File upload limits
exports.UPLOAD_LIMITS = {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // maximum files
};
// Pagination defaults
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};
// Categories for blog and gallery
exports.BLOG_CATEGORIES = [
    'General',
    'Technology',
    'Design',
    'Business',
    'Lifestyle',
    'Health',
    'Travel'
];
exports.GALLERY_CATEGORIES = [
    'renovation',
    'construction',
    'design',
    'other'
];
// Response messages
exports.RESPONSE_MESSAGES = {
    SUCCESS: 'Operation completed successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation failed',
    INVALID_CREDENTIALS: 'Invalid credentials'
};
