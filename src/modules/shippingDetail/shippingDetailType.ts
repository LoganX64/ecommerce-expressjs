import mongoose from 'mongoose';

export interface IShippingDetail {
  _id?: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: Date;
  shippingStatus: string;
}
