import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  pincode: z.string().regex(/^\d{5,6}$/, 'Invalid pincode'),
  phoneNumber: z.string().regex(/^\+?\d{7,15}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  pincode: z
    .string()
    .regex(/^\d{5,6}$/, 'Invalid pincode')
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?\d{7,15}$/, 'Invalid phone number')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
});
