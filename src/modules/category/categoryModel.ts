import mongoose from 'mongoose';
import type { ICategory } from './categoryType';

const categorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

export const CategoryModel = mongoose.model<ICategory>('Category', categorySchema);
