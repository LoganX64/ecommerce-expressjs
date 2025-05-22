import mongoose from 'mongoose';
import type { IProductImage } from './productImageType';

const productImageSchema = new mongoose.Schema<IProductImage>({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  imageUrl: { type: String, required: true },
  uploadedDate: { type: Date, required: true },
});

export const ProductImageModel = mongoose.model<IProductImage>('ProductImage', productImageSchema);
