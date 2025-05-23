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

const reviewRouter = express.Router();

reviewRouter.post(
  '/reviews',
  authenticate,
  authorize(['customer']),
  validateBody(createReviewSchema),
  addReview
);

reviewRouter.put(
  '/reviews/:id',
  authenticate,
  authorize(['customer']),
  validateBody(updateReviewSchema),
  updateReview
);

reviewRouter.delete('/reviews/:id', authenticate, authorize(['customer']), deleteReview);

reviewRouter.get('/reviews', authenticate, authorize(['customer']), getAllReviews);

reviewRouter.get('/reviews/:id', getReviewById);

reviewRouter.get('/products/:productId/reviews', getReviewsByProductId);

export default reviewRouter;
