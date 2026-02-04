"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_js_1 = require("./src/config/database.js");
const mailer_js_1 = require("./src/config/mailer.js");
// Import routes
const admin_routes_js_1 = __importDefault(require("./src/routes/admin.routes.js"));
const blog_routes_js_1 = __importDefault(require("./src/routes/blog.routes.js"));
const gallery_routes_js_1 = __importDefault(require("./src/routes/gallery.routes.js"));
const review_routes_js_1 = __importDefault(require("./src/routes/review.routes.js"));
const contact_routes_js_1 = __importDefault(require("./src/routes/contact.routes.js"));
// Load environment variables
dotenv_1.default.config();
console.log("👉 DATABASE_URL from app:", process.env.DATABASE_URL);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS MUST come FIRST!
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'website-backend-ts',
        database: 'PostgreSQL with Prisma',
        email: 'Nodemailer configured'
    });
});
// API Routes
app.use('/api/admin', admin_routes_js_1.default);
app.use('/api/blogs', blog_routes_js_1.default);
app.use('/api/gallery', gallery_routes_js_1.default);
app.use('/api/reviews', review_routes_js_1.default);
app.use('/api/contact', contact_routes_js_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Start server
const startServer = async () => {
    try {
        await (0, database_js_1.connectDB)();
        await (0, mailer_js_1.testEmailConfig)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Database: PostgreSQL with Prisma`);
            console.log(`📧 Email: Nodemailer configured`);
            console.log(`🔐 Admin: ${process.env.ADMIN_EMAIL}`);
            console.log(`📁 TypeScript with ESM`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import { connectDB } from './src/config/database.js';
// import { testEmailConfig } from './src/config/mailer.js';
// // Import routes
// import adminRoutes from './src/routes/admin.routes.js';
// import blogRoutes from './src/routes/blog.routes.js';
// import galleryRoutes from './src/routes/gallery.routes.js';
// import reviewRoutes from './src/routes/review.routes.js';
// import contactRoutes from './src/routes/contact.routes.js';
// // Load environment variables
// dotenv.config();
// console.log("👉 DATABASE_URL from app:", process.env.DATABASE_URL);
// const app = express();
// const PORT = process.env.PORT || 5000;
// // Middleware - CORS MUST come before routes!
// // Middleware - CORS MUST come FIRST before helmet!
// app.use(cors({
//   origin: '*', // Allow all origins for now
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(helmet());
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(helmet());
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Health check
// app.get('/health', (req, res) => {
//   res.json({
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     service: 'website-backend-ts',
//     database: 'PostgreSQL with Prisma',
//     email: 'Nodemailer configured'
//   });
// });
// // API Routes
// app.use('/api/admin', adminRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/gallery', galleryRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/contact', contactRoutes);
// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: 'Endpoint not found'
//   });
// });
// // Error handler
// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error('Server error:', err);
//   res.status(500).json({
//     success: false,
//     error: 'Internal server error',
//     message: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });
// // Start server
// const startServer = async (): Promise<void> => {
//   try {
//     // Connect to database
//     await connectDB();
//     // Test email configuration
//     await testEmailConfig();
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//       console.log(`📊 Database: PostgreSQL with Prisma`);
//       console.log(`📧 Email: Nodemailer configured`);
//       console.log(`🔐 Admin: ${process.env.ADMIN_EMAIL}`);
//       console.log(`📁 TypeScript with ESM`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };
// // Start the server
// startServer();
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import { connectDB } from './src/config/database.js';
// import { testEmailConfig } from './src/config/mailer.js';
// // Import routes
// import adminRoutes from './src/routes/admin.routes.js';
// import blogRoutes from './src/routes/blog.routes.js';
// import galleryRoutes from './src/routes/gallery.routes.js';
// import reviewRoutes from './src/routes/review.routes.js';
// import contactRoutes from './src/routes/contact.routes.js';
// // Load environment variables
// dotenv.config();
// console.log("👉 DATABASE_URL from app:", process.env.DATABASE_URL);
// const app = express();
// const PORT = process.env.PORT || 5000;
// // Middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://yourdomain.com'] 
//     : ['http://localhost:3000'],
//   credentials: true
// }));
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Health check
// app.get('/health', (req, res) => {
//   res.json({
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     service: 'website-backend-ts',
//     database: 'PostgreSQL with Prisma',
//     email: 'Nodemailer configured'
//   });
// });
// // API Routes
// app.use('/api/admin', adminRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/gallery', galleryRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/contact', contactRoutes);
// // 404 handler - No path parameter needed
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: 'Endpoint not found'
//   });
// });
// // Error handler
// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error('Server error:', err);
//   res.status(500).json({
//     success: false,
//     error: 'Internal server error',
//     message: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });
// // Start server
// const startServer = async (): Promise<void> => {
//   try {
//     // Connect to database
//     await connectDB();
//     // Test email configuration
//     await testEmailConfig();
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//       console.log(`📊 Database: PostgreSQL with Prisma`);
//       console.log(`📧 Email: Nodemailer configured`);
//       console.log(`🔐 Admin: ${process.env.ADMIN_EMAIL}`);
//       console.log(`📁 TypeScript with ESM`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };
// // Start the server
// startServer();
