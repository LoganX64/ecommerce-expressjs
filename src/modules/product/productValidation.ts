import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Image must be a valid URL').optional(),
  price: z.number().positive('Price must be a positive number'),
  stockQty: z.number().int().nonnegative('Stock quantity cannot be negative'),
  categoryId: z.string().min(1, 'Category ID is required'),
  images: z.array(z.string().url('Each image must be a valid URL')).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name cannot be empty').optional(),
  description: z.string().min(1, 'Description cannot be empty').optional(),
  image: z.string().url('Image must be a valid URL').optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  stockQty: z.number().int().nonnegative('Stock quantity cannot be negative').optional(),
  categoryId: z.string().min(1, 'Category ID cannot be empty').optional(),
  images: z.array(z.string().url('Each image must be a valid URL')).optional(),
});
