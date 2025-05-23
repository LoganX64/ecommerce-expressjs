import mongoose from 'mongoose';
import type { IOrderitem } from './orderItemType';

const orderItemSchema = new mongoose.Schema<IOrderitem>({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

export const OrderitemModel = mongoose.model<IOrderitem>('Orderitem', orderItemSchema);
