import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { adminAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { reviewSchema } from '../../schemas/review.schema.js';
const router = Router();
// Public routes
router.get('/', ReviewController.getAllReviews);
router.post('/', validate(reviewSchema), ReviewController.createReview);
// Admin routes
router.get('/admin/all', adminAuth, ReviewController.getAllReviewsAdmin);
router.patch('/:id/status', adminAuth, ReviewController.updateReviewStatus);
router.delete('/:id', adminAuth, ReviewController.deleteReview);
export default router;
//# sourceMappingURL=review.routes.js.map