import { z } from 'zod';

export const createProductImageSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  imageUrl: z.string().url('Image URL must be valid'),
  uploadedDate: z.date({ required_error: 'Uploaded date is required' }),
});

export const updateProductImageSchema = z.object({
  imageUrl: z.string().url('Image URL must be valid').optional(),
  uploadedDate: z.date().optional(),
});
