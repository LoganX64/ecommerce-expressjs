import mongoose from 'mongoose';
import type { ICartItem } from './cartItemType';

const cartItemSchema = new mongoose.Schema<ICartItem>(
  {
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CartItemModel = mongoose.model<ICartItem>('CartItem', cartItemSchema);
