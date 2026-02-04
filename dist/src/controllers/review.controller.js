import { ReviewService } from '../services/review.service.js';
export class ReviewController {
    // Get all reviews (public)
    static async getAllReviews(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const result = await ReviewService.getAllReviews(Number(page), Number(limit));
            res.json({
                success: true,
                ...result
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch reviews'
            });
        }
    }
    // Create review (public)
    // static async createReview(req: Request, res: Response) {
    //   try {
    //     // Validate request body with Zod schema
    //     const validatedData = reviewSchema.parse(req.body);
    //     const review = await ReviewService.createReview(
    //       validatedData,
    //       req.ip,
    //       req.get('user-agent')
    //     );
    //     res.status(201).json({
    //       success: true,
    //       message: 'Review submitted successfully',
    //       review
    //     });
    //   } catch (error: any) {
    //     // Handle Zod validation errors
    //     if (error instanceof ZodError) {
    //       return res.status(400).json({
    //         success: false,
    //         error: 'Validation failed',
    //         details: error.errors.map(err => ({
    //           field: err.path.join('.'),
    //           message: err.message
    //         }))
    //       });
    //     }
    //     // Handle other errors
    //     res.status(400).json({
    //       success: false,
    //       error: error.message || 'Failed to create review'
    //     });
    //   }
    // }
    static async createReview(req, res) {
        try {
            // No need to validate here - middleware already did it
            const review = await ReviewService.createReview(req.body, req.ip, req.get('user-agent'));
            res.status(201).json({
                success: true,
                message: 'Review submitted successfully',
                review
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message || 'Failed to create review'
            });
        }
    }
    // Admin: Get all reviews
    static async getAllReviewsAdmin(req, res) {
        try {
            const { page = 1, limit = 20 } = req.query;
            const result = await ReviewService.getAllReviewsForAdmin(Number(page), Number(limit));
            res.json({
                success: true,
                ...result
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch reviews'
            });
        }
    }
    // Admin: Update review status
    static async updateReviewStatus(req, res) {
        try {
            const { id } = req.params;
            const { isApproved } = req.body;
            const review = await ReviewService.updateReviewStatus(Number(id), isApproved);
            res.json({
                success: true,
                message: `Review ${isApproved ? 'approved' : 'unapproved'} successfully`,
                review
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
    // Admin: Delete review
    static async deleteReview(req, res) {
        try {
            const { id } = req.params;
            await ReviewService.deleteReview(Number(id));
            res.json({
                success: true,
                message: 'Review deleted successfully'
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
}
//# sourceMappingURL=review.controller.js.map