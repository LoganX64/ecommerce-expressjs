import mongoose from 'mongoose';
import { IAdmin } from './adminType';

const adminSchema = new mongoose.Schema<IAdmin>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
  registrationDate: { type: Date, required: true },
});

export const AdminModel = mongoose.model<IAdmin>('Admin', adminSchema);
