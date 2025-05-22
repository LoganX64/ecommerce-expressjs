import { Request, Response, NextFunction } from 'express';
import { CustomerModel } from './customerModel';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/authenticate';
import { AppError } from '../../utils/AppError';

// Add a customer
export const addCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, address, pincode, phoneNumber, email } = req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User ID missing from token', 401);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid userId', 400);
    }

    // Create new customer linked to userId
    const newCustomer = await CustomerModel.create({
      userId,
      name,
      address,
      pincode,
      phoneNumber,
      email,
    });

    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    next(error);
  }
};

// Update customer by customer id
export const updateCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.params.id;
    const userId = req.userId;
    const updateData = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError('Unauthorized: Invalid user ID', 401);
    }

    if (!mongoose.isValidObjectId(customerId)) {
      throw new AppError('Invalid customer ID', 400);
    }

    const customer = await CustomerModel.findById(customerId);

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    if (!customer.userId || customer.userId.toString() !== userId) {
      throw new AppError('You are not authorized to update this customer', 403);
    }

    const updatedCustomer = await CustomerModel.findByIdAndUpdate(customerId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    next(error);
  }
};

export const getAllCustomers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'admin') {
      throw new AppError('Access forbidden: Admins only', 403);
    }

    const customers = await CustomerModel.find().populate('userId', 'email userRole');
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    next(error);
  }
};

// Get customer by id - Admin only
export const getCustomerById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'admin') {
      throw new AppError('Access forbidden: Admins only', 403);
    }

    const customerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      throw new AppError('Invalid customer id', 400);
    }

    const customer = await CustomerModel.findById(customerId).populate('userId', 'email userRole');

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};
