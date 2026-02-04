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
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000'],
    credentials: true
}));
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
        await (0, database_js_1.connectDB)();
        // Test email configuration
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
// Start the server
startServer();
