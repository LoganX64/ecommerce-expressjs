import mongoose from 'mongoose';

export interface INotification {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
