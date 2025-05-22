import { z } from 'zod';

// Register user schema
export const registerUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userRole: z.enum(['customer', 'seller', 'admin']),
});

// Login user schema
export const loginUserSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password is required'),
});
