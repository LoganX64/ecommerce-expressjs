import mongoose, { Schema } from 'mongoose';
import { ISeller } from './sellerType';

const sellerSchema = new mongoose.Schema<ISeller>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  pincode: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
  createdDate: { type: Date, required: true },
});

export const SellerModel = mongoose.model<ISeller>('Seller', sellerSchema);
