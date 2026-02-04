// Constants
export const APP_NAME = "Website Backend";
export const APP_VERSION = "1.0.0";
// API Rate limiting
export const RATE_LIMIT = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
};
// File upload limits
export const UPLOAD_LIMITS = {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // maximum files
};
// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};
// Categories for blog and gallery
export const BLOG_CATEGORIES = [
    'General',
    'Technology',
    'Design',
    'Business',
    'Lifestyle',
    'Health',
    'Travel'
];
export const GALLERY_CATEGORIES = [
    'renovation',
    'construction',
    'design',
    'other'
];
// Response messages
export const RESPONSE_MESSAGES = {
    SUCCESS: 'Operation completed successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation failed',
    INVALID_CREDENTIALS: 'Invalid credentials'
};
