import mongoose from 'mongoose';
import type { IProduct } from './productType';

const productSchema = new mongoose.Schema<IProduct>({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  stockQty: { type: Number, required: true },
  lastUpdated: { type: Date, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, required: true },
  isActive: { type: Boolean, default: false },
});

export const ProductModel = mongoose.model<IProduct>('Product', productSchema);
