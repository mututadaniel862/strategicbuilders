"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_js_1 = __importDefault(require("../config/database.js"));
// Admin authentication middleware
const adminAuth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            res.status(401).json({
                success: false,
                error: 'No authorization token provided'
            });
            return;
        }
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'No token found in authorization header'
            });
            return;
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find admin in database
        const admin = await database_js_1.default.admin.findUnique({
            where: { id: decoded.id }
        });
        if (!admin) {
            res.status(401).json({
                success: false,
                error: 'Admin account not found'
            });
            return;
        }
        // Attach admin to request
        req.admin = {
            id: admin.id,
            email: admin.email,
            role: admin.role
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                error: 'Invalid or malformed token'
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                error: 'Token has expired'
            });
            return;
        }
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Authentication server error'
        });
    }
};
exports.adminAuth = adminAuth;
// Generate JWT token
const generateToken = (adminId, email, role) => {
    return jsonwebtoken_1.default.sign({ id: adminId, email, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};
exports.generateToken = generateToken;
