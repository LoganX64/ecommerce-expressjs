import type mongoose from 'mongoose';

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  price: number;
  stockQty: number;
  lastUpdated: Date;
  categoryId: mongoose.Types.ObjectId;
  isActive?: boolean;
}
