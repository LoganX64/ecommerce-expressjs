import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ReviewModel } from './reviewModel';
import { OrderModel } from '../order/orderModel';
import { AppError } from '../../utils/AppError';
import type { AuthRequest } from '../../middleware/authenticate';

// Add a review (only if customer ordered & it's delivered)
export const addReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.userId;
    const { productId, reviewText, rating } = req.body;

    // Check if customer ordered this product and order is delivered
    const hasOrdered = await OrderModel.exists({
      customerId,
      status: 'delivered',
      _id: {
        $in: await OrderModel.distinct('_id', {
          customerId,
          status: 'delivered',
        }),
      },
    });

    if (!hasOrdered) {
      throw new AppError('Review can only be added after order is delivered.', 400);
    }

    const newReview = await ReviewModel.create({
      customerId,
      productId,
      reviewText,
      rating,
      createdDate: new Date(),
    });

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    next(error);
  }
};

// Update a review (only same customer can update)
export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.userId;
    const { reviewId } = req.params;
    const { reviewText, rating } = req.body;

    const review = await ReviewModel.findOne({ _id: reviewId, customerId });

    if (!review) {
      throw new AppError('Review not found or unauthorized', 404);
    }

    review.reviewText = reviewText;
    review.rating = rating;
    review.createdDate = new Date();

    await review.save();

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// Delete a review
export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.userId;
    const { reviewId } = req.params;

    const review = await ReviewModel.findOne({ _id: reviewId, customerId });
    if (!review) {
      throw new AppError('Review not found or unauthorized', 404);
    }

    await ReviewModel.deleteOne({ _id: reviewId });

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all reviews (admin or public listing)
export const getAllReviews = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await ReviewModel.find().sort({ createdDate: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// Get review by ID
export const getReviewById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// Get reviews by Product ID
export const getReviewsByProductId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewModel.find({ productId }).sort({ createdDate: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
