"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE_MESSAGES = exports.GALLERY_CATEGORIES = exports.BLOG_CATEGORIES = exports.PAGINATION = exports.UPLOAD_LIMITS = exports.RATE_LIMIT = exports.APP_VERSION = exports.APP_NAME = exports.uploadGalleryImage = exports.uploadBlogImage = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
/* =========================
   CLOUDINARY CONFIG
========================= */
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
/* -------------------------
   BLOG IMAGE UPLOAD
------------------------- */
const blogStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async () => ({
        folder: 'blogs', // folder in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    }),
});
exports.uploadBlogImage = (0, multer_1.default)({
    storage: blogStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB per file
        files: Infinity, // no limit on number of files
    },
});
/* -------------------------
   GALLERY IMAGE UPLOAD
------------------------- */
const galleryStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async () => ({
        folder: 'galleries', // folder in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    }),
});
exports.uploadGalleryImage = (0, multer_1.default)({
    storage: galleryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB per file
        files: Infinity, // no limit on number of files
    },
});
/* =========================
   APP CONSTANTS
========================= */
exports.APP_NAME = 'Website Backend';
exports.APP_VERSION = '1.0.0';
exports.RATE_LIMIT = {
    windowMs: 15 * 60 * 1000,
    max: 100,
};
exports.UPLOAD_LIMITS = {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
    files: Infinity, // no limit
};
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};
exports.BLOG_CATEGORIES = [
    'General',
    'Technology',
    'Design',
    'Business',
    'Lifestyle',
    'Health',
    'Travel',
];
exports.GALLERY_CATEGORIES = [
    'renovation',
    'construction',
    'design',
    'other',
];
exports.RESPONSE_MESSAGES = {
    SUCCESS: 'Operation completed successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation failed',
    INVALID_CREDENTIALS: 'Invalid credentials',
};
