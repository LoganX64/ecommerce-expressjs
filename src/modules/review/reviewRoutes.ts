// reviewRoutes.ts
import express from 'express';
import {
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getReviewById,
  getReviewsByProductId,
} from './reviewController';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody, validateParams } from '../../middleware/validate';
import { createReviewSchema, updateReviewSchema } from './reviewValidation';

const router = express.Router();

// Add a review (customer, only if order delivered)
router.post(
  '/reviews',
  authenticate,
  authorize(['customer']),
  validateBody(createReviewSchema),
  addReview
);

// Update a review (customer can update own review)
router.put(
  '/reviews/:id',
  authenticate,
  authorize(['customer']),
  validateBody(updateReviewSchema),
  updateReview
);

// Delete a review (customer can delete own review)
router.delete('/reviews/:id', authenticate, authorize(['customer']), deleteReview);

// Get all reviews (public or optionally admin-only)
router.get('/reviews', authenticate, authorize(['customer']), getAllReviews);

// Get a review by ID (public)
router.get('/reviews/:id', getReviewById);

// Get reviews by Product ID (public)
router.get('/products/:productId/reviews', getReviewsByProductId);

export default router;
