"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_js_1 = require("../controllers/review.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const validate_js_1 = require("../middleware/validate.js");
const review_schema_js_1 = require("../../schemas/review.schema.js");
const router = (0, express_1.Router)();
// Public routes
router.get('/', review_controller_js_1.ReviewController.getAllReviews);
router.post('/', (0, validate_js_1.validate)(review_schema_js_1.reviewSchema), review_controller_js_1.ReviewController.createReview);
// Admin routes
router.get('/admin/all', auth_js_1.adminAuth, review_controller_js_1.ReviewController.getAllReviewsAdmin);
router.patch('/:id/status', auth_js_1.adminAuth, review_controller_js_1.ReviewController.updateReviewStatus);
router.delete('/:id', auth_js_1.adminAuth, review_controller_js_1.ReviewController.deleteReview);
exports.default = router;
