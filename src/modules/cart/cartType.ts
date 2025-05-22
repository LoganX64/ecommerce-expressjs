import type mongoose from 'mongoose';

export interface ICart {
  _id?: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
}
