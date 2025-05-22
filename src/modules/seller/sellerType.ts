import mongoose from 'mongoose';

export interface ISeller {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  pincode: string;
  lastUpdated: Date;
  createdDate: Date;
}
