import { Request, Response, NextFunction } from 'express';
import { SellerModel } from './sellerModel';
import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/authenticate';
import { AppError } from '../../utils/AppError';

// Add a seller
export const addSeller = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, address, pincode, phoneNumber, email } = req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User ID missing from token', 401);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid userId', 400);
    }

    const newSeller = await SellerModel.create({
      userId,
      name,
      address,
      pincode,
      phoneNumber,
      email,
      createdDate: new Date(),
      lastUpdated: new Date(),
    });

    res.status(201).json({ success: true, data: newSeller });
  } catch (error) {
    next(error);
  }
};

// Update seller by seller id
export const updateSeller = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.params.id;
    const userId = req.userId;
    const updateData = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError('Unauthorized: Invalid user ID', 401);
    }

    if (!mongoose.isValidObjectId(sellerId)) {
      throw new AppError('Invalid seller ID', 400);
    }

    const seller = await SellerModel.findById(sellerId);

    if (!seller) {
      throw new AppError('Seller not found', 404);
    }

    if (!seller.userId || seller.userId.toString() !== userId) {
      throw new AppError('You are not authorized to update this seller', 403);
    }

    updateData.lastUpdated = new Date();

    const updatedSeller = await SellerModel.findByIdAndUpdate(sellerId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedSeller });
  } catch (error) {
    next(error);
  }
};

// Get all sellers - Admin only
export const getAllSellers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'admin') {
      throw new AppError('Access forbidden: Admins only', 403);
    }

    const sellers = await SellerModel.find().populate('userId', 'email userRole');
    res.status(200).json({ success: true, data: sellers });
  } catch (error) {
    next(error);
  }
};

// Get seller by id - Admin only
export const getSellerById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'admin') {
      throw new AppError('Access forbidden: Admins only', 403);
    }

    const sellerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      throw new AppError('Invalid seller ID', 400);
    }

    const seller = await SellerModel.findById(sellerId).populate('userId', 'email userRole');

    if (!seller) {
      throw new AppError('Seller not found', 404);
    }

    res.status(200).json({ success: true, data: seller });
  } catch (error) {
    next(error);
  }
};
