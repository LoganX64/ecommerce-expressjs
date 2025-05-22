import type mongoose from 'mongoose';

export interface IRazorpayPayment {
  _id?: mongoose.Types.ObjectId;
  paymentId: string;
  orderId: mongoose.Types.ObjectId;
  status: string;
  amount: number;
  createdAt: Date;
}
