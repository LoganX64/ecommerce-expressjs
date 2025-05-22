import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/authenticate';
import { AppError } from '../../utils/AppError';
import { WishlistModel } from './wishlistModel';
import { wishlistSchema } from './wishlistValidation';

export const addToWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'customer') {
      throw new AppError('Only customers can add to wishlist', 403);
    }
    if (!req.userId) {
      throw new AppError('User not authenticated', 401);
    }

    const validated = wishlistSchema.parse(req.body);

    const existing = await WishlistModel.findOne({
      customerId: req.userId,
      productId: validated.productId,
    });

    if (existing) {
      throw new AppError('Product already in wishlist', 409);
    }

    const wishlistItem = new WishlistModel({
      customerId: req.userId,
      productId: validated.productId,
      addedDate: new Date(),
    });

    await wishlistItem.save();

    res.status(201).json({ success: true, data: wishlistItem });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'customer') {
      throw new AppError('Only customers can remove from wishlist', 403);
    }

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError('Invalid wishlist item ID', 400);
    }

    const deleted = await WishlistModel.findOneAndDelete({
      _id: id,
      customerId: req.userId,
    });

    if (!deleted) {
      throw new AppError('Wishlist item not found', 404);
    }

    res.status(200).json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'customer') {
      throw new AppError('Only customers can view wishlist', 403);
    }

    const wishlist = await WishlistModel.find({ customerId: req.userId }).populate('productId');

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};
