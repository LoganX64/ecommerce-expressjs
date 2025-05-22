import mongoose from 'mongoose';
import { IRegistration } from './registrationType';

const registrationSchema = new mongoose.Schema<IRegistration>({
  sellerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seller' },
  registrationStatus: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Admin' },
});

export const RegistrationModel = mongoose.model<IRegistration>('Registration', registrationSchema);
