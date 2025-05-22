import mongoose from 'mongoose';
import { IDiscount } from './discountType';

const discountSchema = new mongoose.Schema<IDiscount>(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // assuming User model holds sellers too
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },

    // The discount value (e.g. 10 or 5)
    value: { type: Number, required: true },

    // The type of discount: 'percentage' or 'fixed'
    valueType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },

    // Optional: restrict which products or categories this discount applies to
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    usageLimit: { type: Number }, // total max uses (optional)
    usageCount: { type: Number, default: 0 }, // track usage

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DiscountModel = mongoose.model<IDiscount>('Discount', discountSchema);
