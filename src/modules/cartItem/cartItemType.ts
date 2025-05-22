import type mongoose from 'mongoose';
import { IProduct } from '../product/productType';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  cartId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId | IProduct;
  quantity: number;
  lastUpdated: Date;
}
