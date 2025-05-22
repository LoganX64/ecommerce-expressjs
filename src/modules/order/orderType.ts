import type mongoose from 'mongoose';

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  totalPrice: number;
  discountAmount: number;
  status: OrderStatus;
  orderDate: Date;
  created?: Date;
  updated?: Date;
  notes?: string;
  shippingId: mongoose.Types.ObjectId;
}
