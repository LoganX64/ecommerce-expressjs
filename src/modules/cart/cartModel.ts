import mongoose from 'mongoose';
import type { ICart } from './cartType';

const cartSchema = new mongoose.Schema<ICart>(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  },
  { timestamps: true }
);

export const CartModel = mongoose.model<ICart>('Cart', cartSchema);
