import mongoose from 'mongoose';
import { IShippingDetail } from './shippingDetailType';

const shippingDetailSchema = new mongoose.Schema<IShippingDetail>({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  trackingNumber: { type: String, required: true },
  carrier: { type: String, required: true },
  estimatedDelivery: { type: Date, required: true },
  shippingStatus: { type: String, required: true },
});

export const ShippingdetailModel = mongoose.model<IShippingDetail>(
  'Shippingdetail',
  shippingDetailSchema
);
