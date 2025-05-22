import mongoose from 'mongoose';
import type { IPayment } from './paymentType';

const paymentSchema = new mongoose.Schema<IPayment>({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  transactionId: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  currency: { type: String, required: true },
});

export const PaymentModel = mongoose.model<IPayment>('Payment', paymentSchema);
