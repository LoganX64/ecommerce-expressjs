import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { CategoryModel } from './categoryModel';
import { AuthRequest } from '../../middleware/authenticate';
import { AppError } from '../../utils/AppError';

export const addCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'admin') {
      throw new AppError('Only admins can add categories', 403);
    }

    const { name, description } = req.body;

    const newCategory = await CategoryModel.create({ name, description, isActive: true });

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'admin') {
      throw new AppError('Only admins can update categories', 403);
    }

    const categoryId = req.params.id;
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new AppError('Invalid category ID', 400);
    }

    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { _id: categoryId, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      throw new AppError('Category not found or inactive', 404);
    }

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'admin') {
      throw new AppError('Only admins can delete categories', 403);
    }

    const categoryId = req.params.id;
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new AppError('Invalid category ID', 400);
    }

    const deleted = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      throw new AppError('Category not found', 404);
    }

    res.status(200).json({ success: true, message: 'Category deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await CategoryModel.find({ isActive: true });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
