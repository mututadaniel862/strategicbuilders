import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';
import { testEmailConfig } from './src/config/mailer.js';
// Import routes
import adminRoutes from './src/routes/admin.routes.js';
import blogRoutes from './src/routes/blog.routes.js';
import galleryRoutes from './src/routes/gallery.routes.js';
import reviewRoutes from './src/routes/review.routes.js';
import contactRoutes from './src/routes/contact.routes.js';
// Load environment variables
dotenv.config();
console.log("👉 DATABASE_URL from app:", process.env.DATABASE_URL);
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000'],
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
// 404 handler - No path parameter needed
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
        // Connect to database
        await connectDB();
        // Test email configuration
        await testEmailConfig();
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
// Start the server
startServer();
//# sourceMappingURL=index.js.map