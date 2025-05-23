import mongoose from 'mongoose';
import { IUser } from './userType';

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    userRole: { type: String, required: true, enum: ['customer', 'seller', 'admin'] },
    refreshToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model('User', userSchema);
