import { z } from 'zod';

export const createSellerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phoneNumber: z.string().regex(/^\+?\d{7,15}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  pincode: z.string().regex(/^\d{5,6}$/, 'Invalid pincode'),
});

export const updateSellerSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  address: z.string().min(1, 'Address cannot be empty').optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?\d{7,15}$/, 'Invalid phone number')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  pincode: z
    .string()
    .regex(/^\d{5,6}$/, 'Invalid pincode')
    .optional(),
});
