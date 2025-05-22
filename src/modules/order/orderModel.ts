import mongoose from 'mongoose';
import type { IOrder, OrderStatus } from './orderType';

const orderStatusEnum = ['pending', 'shipped', 'delivered', 'cancelled'] as const;

const orderSchema = new mongoose.Schema<IOrder>(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    totalPrice: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    status: { type: String, required: true, enum: orderStatusEnum },
    orderDate: { type: Date, required: true },
    notes: { type: String, default: '' },
    shippingId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: { createdAt: 'created', updatedAt: 'updated' }, // auto-manage created & updated
  }
);

export const OrderModel = mongoose.model<IOrder>('Order', orderSchema);
