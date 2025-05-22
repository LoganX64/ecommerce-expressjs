import type mongoose from 'mongoose';

export interface ICategory {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  isActive: boolean;
}
