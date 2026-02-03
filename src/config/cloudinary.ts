import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

/* =========================
   CLOUDINARY CONFIG
========================= */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* -------------------------
   BLOG IMAGE UPLOAD
------------------------- */
const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'blogs', // folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  }),
});

export const uploadBlogImage = multer({
  storage: blogStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
    files: Infinity,             // no limit on number of files
  },
});

/* -------------------------
   GALLERY IMAGE UPLOAD
------------------------- */
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'galleries', // folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  }),
});

export const uploadGalleryImage = multer({
  storage: galleryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
    files: Infinity,             // no limit on number of files
  },
});

/* =========================
   APP CONSTANTS
========================= */

export const APP_NAME = 'Website Backend';
export const APP_VERSION = '1.0.0';

export const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

export const UPLOAD_LIMITS = {
  fileSize: 10 * 1024 * 1024, // 10 MB per file
  files: Infinity,             // no limit
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const BLOG_CATEGORIES = [
  'General',
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Health',
  'Travel',
];

export const GALLERY_CATEGORIES = [
  'renovation',
  'construction',
  'design',
  'other',
];

export const RESPONSE_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation failed',
  INVALID_CREDENTIALS: 'Invalid credentials',
};
