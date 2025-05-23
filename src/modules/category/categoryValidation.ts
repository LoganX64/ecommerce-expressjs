import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().min(1, 'Description is required'),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});
