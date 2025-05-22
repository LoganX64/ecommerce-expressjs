import mongoose from 'mongoose';

export interface IAdmin {
  _id?: mongoose.Types.ObjectId; // optional _id for MongoDB document
  name: string;
  password: string;
  address: string;
  phoneNumber: string;
  lastUpdated: Date;
  registrationDate: Date;
}
