import prisma from '../config/database.js';
export class ReviewService {
    // Get all reviews (public)
    static async getAllReviews(page = 1, limit = 10, approvedOnly = true) {
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (approvedOnly) {
            whereClause.isApproved = true;
        }
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    rating: true,
                    comment: true,
                    createdAt: true
                }
            }),
            prisma.review.count({ where: whereClause })
        ]);
        // Calculate average rating
        const averageRating = await prisma.review.aggregate({
            where: { isApproved: true },
            _avg: {
                rating: true
            }
        });
        return {
            reviews,
            averageRating: averageRating._avg.rating || 0,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    }
    // Create review
    static async createReview(reviewData, ipAddress, userAgent) {
        const review = await prisma.review.create({
            data: {
                ...reviewData,
                ipAddress,
                userAgent,
                isApproved: true // Auto-approve as requested
            }
        });
        await prisma.log.create({
            data: {
                action: 'review_created',
                details: { reviewId: review.id, name: review.name },
                userType: 'public',
                endpoint: 'POST /reviews'
            }
        });
        return review;
    }
    // Admin: Get all reviews (including unapproved)
    static async getAllReviewsForAdmin(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.review.count()
        ]);
        return {
            reviews,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    }
    // Admin: Update review approval status
    static async updateReviewStatus(id, isApproved) {
        const review = await prisma.review.findUnique({
            where: { id }
        });
        if (!review) {
            throw new Error('Review not found');
        }
        const updatedReview = await prisma.review.update({
            where: { id },
            data: { isApproved }
        });
        await prisma.log.create({
            data: {
                action: 'review_status_updated',
                details: { reviewId: id, status: isApproved, name: review.name },
                userType: 'admin',
                endpoint: 'PATCH /reviews/:id/status'
            }
        });
        return updatedReview;
    }
    // Admin: Delete review
    static async deleteReview(id) {
        const review = await prisma.review.findUnique({
            where: { id }
        });
        if (!review) {
            throw new Error('Review not found');
        }
        await prisma.review.delete({
            where: { id }
        });
        await prisma.log.create({
            data: {
                action: 'review_deleted',
                details: { reviewId: id, name: review.name },
                userType: 'admin',
                endpoint: 'DELETE /reviews/:id'
            }
        });
        return { message: 'Review deleted successfully' };
    }
}
