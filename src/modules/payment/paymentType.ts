import type mongoose from 'mongoose';

export interface IPayment {
  _id?: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  paymentDate: Date;
  currency: string;
}
