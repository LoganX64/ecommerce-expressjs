import mongoose from 'mongoose';
import { IReview } from './reviewType';

const reviewSchema = new mongoose.Schema<IReview>({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  reviewText: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

// Optional: Ensure unique review per customer/product
// reviewSchema.index({ customerId: 1, productId: 1 }, { unique: true });

export const ReviewModel = mongoose.model<IReview>('Review', reviewSchema);
