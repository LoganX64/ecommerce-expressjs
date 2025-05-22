import type mongoose from 'mongoose';

export interface IProductImage {
  _id?: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  imageUrl: string;
  uploadedDate: Date;
}
