// validations/reviewValidation.ts
import { z } from 'zod';

export const createReviewSchema = z.object({
  productId: z
    .string({ required_error: 'Product ID is required' })
    .refine((val) => /^[a-f\d]{24}$/i.test(val), {
      message: 'Invalid product ID format',
    }),
  reviewText: z
    .string({ required_error: 'Review text is required' })
    .min(3, 'Review must be at least 3 characters'),
  rating: z
    .number({ required_error: 'Rating is required' })
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
});

export const updateReviewSchema = z
  .object({
    reviewText: z.string().min(3, 'Review must be at least 3 characters').optional(),
    rating: z.number().int().min(1).max(5).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field (reviewText or rating) is required',
  });
