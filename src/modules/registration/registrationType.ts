import mongoose from 'mongoose';

export interface IRegistration {
  _id?: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  registrationStatus: string;
  adminId: mongoose.Types.ObjectId;
}
