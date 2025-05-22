import mongoose from 'mongoose';

export interface IWishlist {
  _id?: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  addedDate: Date;
}
