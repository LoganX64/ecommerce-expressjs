import mongoose, { Schema } from 'mongoose';
import { ICustomer } from './customerType';

const customerSchema = new Schema<ICustomer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
  },
  {
    timestamps: { createdAt: 'registrationDate', updatedAt: 'lastUpdated' },
  }
);

export const CustomerModel = mongoose.model<ICustomer>('Customer', customerSchema);
