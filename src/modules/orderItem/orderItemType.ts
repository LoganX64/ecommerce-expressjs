import mongoose from 'mongoose';
import type { IProduct } from '../product/productType';

export interface IOrderitem {
  _id?: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId | IProduct;
  quantity: number;
  price: number;
}
