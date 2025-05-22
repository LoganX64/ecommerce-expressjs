import mongoose from 'mongoose';

export interface IReview {
  _id?: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  reviewText: string;
  createdDate: Date;
  rating: number;
}
