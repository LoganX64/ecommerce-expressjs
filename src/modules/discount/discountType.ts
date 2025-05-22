import { Types } from 'mongoose';

export interface IDiscount {
  _id?: Types.ObjectId;

  sellerId: Types.ObjectId;
  title: string;
  description?: string;

  value: number;
  valueType: 'percentage' | 'fixed';

  applicableProducts?: Types.ObjectId[];
  applicableCategories?: Types.ObjectId[];

  startDate?: Date;
  endDate?: Date;

  usageLimit?: number;
  usageCount?: number;

  active?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
