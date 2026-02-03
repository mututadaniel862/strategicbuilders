import { z } from 'zod';

export const reviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  rating: z.number().min(1).max(5).default(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000),
});

export type ReviewData = z.infer<typeof reviewSchema>;