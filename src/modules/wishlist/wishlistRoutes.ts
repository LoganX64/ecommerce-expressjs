import express from 'express';
import { addToWishlist, removeFromWishlist, getWishlist } from './wishlistController';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody } from '../../middleware/validate';
import { wishlistSchema } from './wishlistValidation';

const wishlistRouter = express.Router();

wishlistRouter.post(
  '/wishlist',
  authenticate,
  authorize(['customer']),
  validateBody(wishlistSchema),
  addToWishlist
);

wishlistRouter.delete('/wishlist/:id', authenticate, authorize(['customer']), removeFromWishlist);

wishlistRouter.get('/wishlist', authenticate, authorize(['customer']), getWishlist);

export default wishlistRouter;
