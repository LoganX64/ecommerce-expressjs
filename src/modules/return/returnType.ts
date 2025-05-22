import mongoose from 'mongoose';

export interface IReturn {
  _id?: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  returnReason: string;
  returnStatus: string;
  refundAmount: number;
  returnDate: Date;
}
