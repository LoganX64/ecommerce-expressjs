import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdValidation = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const orderStatusEnum = ['pending', 'shipped', 'delivered', 'cancelled'] as const;

export const createOrderSchema = z.object({
  shippingId: objectIdValidation,
  notes: z.string().optional(),
});

export const cancelOrderSchema = z.object({
  orderId: objectIdValidation,
});

export const getOrderByIdSchema = z.object({
  orderId: objectIdValidation,
});

export const orderSchema = z.object({
  customerId: objectIdValidation,
  totalPrice: z.number().nonnegative(),
  discountAmount: z.number().nonnegative(),
  status: z.enum(orderStatusEnum),
  orderDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  notes: z.string().optional(),
  shippingId: objectIdValidation,
});
