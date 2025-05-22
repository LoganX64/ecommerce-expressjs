import mongoose from 'mongoose';
import { IReturn } from './returnType';

const returnSchema = new mongoose.Schema<IReturn>({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  returnReason: { type: String, required: true },
  returnStatus: { type: String, required: true },
  refundAmount: { type: Number, required: true },
  returnDate: { type: Date, required: true },
});

export const ReturnModel = mongoose.model<IReturn>('Return', returnSchema);
