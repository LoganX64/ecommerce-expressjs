import mongoose from 'mongoose';

export interface ICustomer {
  _id?: mongoose.Types.ObjectId; // optional, because before saving it might not exist yet
  userId: mongoose.Types.ObjectId;
  name: string;
  address: string;
  pincode: string;
  phoneNumber: string;
  email: string;
  lastUpdated: Date;
  registrationDate: Date;
}
