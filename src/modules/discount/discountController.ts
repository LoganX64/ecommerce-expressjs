import { Request, Response, NextFunction } from 'express';
import { DiscountModel } from './discountModel';
import { discountSchema } from './discountValidation';
import { AppError } from '../../utils/AppError';
import { AuthRequest } from '../../middleware/authenticate';
import mongoose from 'mongoose';

// Create a new discount (only for sellers)
export const createDiscount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'seller') {
      throw new AppError('Only sellers can create discounts', 403);
    }

    const validated = discountSchema.parse(req.body);

    const discount = await DiscountModel.create({
      ...validated,
      sellerId: req.userId,
    });

    res.status(201).json({ success: true, data: discount });
  } catch (error) {
    next(error);
  }
};

// List discounts (admin sees all, sellers see theirs)
export const listDiscounts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter = req.userRole === 'admin' ? {} : { sellerId: req.userId };
    const discounts = await DiscountModel.find(filter).sort({ createdAt: -1 }).lean();

    res.status(200).json({ success: true, data: discounts });
  } catch (error) {
    next(error);
  }
};

// Get single discount by ID
export const getDiscountById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid discount ID', 400);

    const discount = await DiscountModel.findById(id).lean();
    if (!discount) throw new AppError('Discount not found', 404);

    res.status(200).json({ success: true, data: discount });
  } catch (error) {
    next(error);
  }
};

// Update discount (only by owning seller)
export const updateDiscount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'seller') {
      throw new AppError('Only sellers can update discounts', 403);
    }

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid discount ID', 400);

    const validated = discountSchema.partial().parse(req.body);

    const updated = await DiscountModel.findOneAndUpdate(
      { _id: id, sellerId: req.userId },
      validated,
      { new: true }
    );

    if (!updated) throw new AppError('Discount not found or unauthorized', 404);

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// Delete a discount (seller only)
export const deleteDiscount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'seller') {
      throw new AppError('Only sellers can delete discounts', 403);
    }

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid discount ID', 400);

    const deleted = await DiscountModel.findOneAndDelete({
      _id: id,
      sellerId: req.userId,
    });

    if (!deleted) throw new AppError('Discount not found or unauthorized', 404);

    res.status(200).json({ success: true, message: 'Discount deleted' });
  } catch (error) {
    next(error);
  }
};
