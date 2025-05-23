import mongoose from 'mongoose';
import { IDiscount } from './discountType';

const discountSchema = new mongoose.Schema<IDiscount>(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },

    value: { type: Number, required: true },

    valueType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },

    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DiscountModel = mongoose.model<IDiscount>('Discount', discountSchema);
