import { z } from 'zod';

export const discountSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),

  value: z.number().positive('Discount value must be greater than 0'),

  valueType: z.enum(['percentage', 'fixed'], {
    required_error: 'Discount type is required',
  }),

  applicableProducts: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  usageLimit: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});
