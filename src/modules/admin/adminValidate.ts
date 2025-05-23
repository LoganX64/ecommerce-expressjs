import { z } from 'zod';
import mongoose from 'mongoose';

export const adminSchemaValidation = z.object({
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'), // adjust length as needed
  address: z.string().min(1, 'Address is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'), // you can add regex for phone format if you want
  lastUpdated: z.preprocess(
    (arg) => {
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    },
    z.date({ required_error: 'Last updated date is required' })
  ),
  registrationDate: z.preprocess(
    (arg) => {
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    },
    z.date({ required_error: 'Registration date is required' })
  ),
});
