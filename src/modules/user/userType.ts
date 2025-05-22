import mongoose from 'mongoose';

export type UserRole = 'customer' | 'seller' | 'admin';

export interface IUser {
  _id: mongoose.Types.ObjectId; // Actual ObjectId type
  email: string;
  password: string;
  userRole: UserRole;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isDeleted: boolean;
  createdAt?: Date; // from mongoose timestamps
  updatedAt?: Date; // from mongoose timestamps
}
