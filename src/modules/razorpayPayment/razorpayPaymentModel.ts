import mongoose from 'mongoose';
import type { IRazorpayPayment } from './razorpayPaymentType';

const razorpayPaymentSchema = new mongoose.Schema<IRazorpayPayment>({
  paymentId: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

export const RazorpaypaymentModel = mongoose.model<IRazorpayPayment>(
  'Razorpaypayment',
  razorpayPaymentSchema
);
