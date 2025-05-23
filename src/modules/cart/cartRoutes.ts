import express from 'express';
import { addToCart, updateCartItem, removeCartItem, getCart } from './cartController';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody, validateParams } from '../../middleware/validate';
import {
  cartItemIdParamSchema,
  cartItemSchema,
  updateCartItemSchema,
} from '../cartItem/cartItemValidate';

const cartRouter = express.Router();

// Add item to cart
cartRouter.post(
  '/cart',
  authenticate,
  authorize(['customer']),
  validateBody(cartItemSchema),
  addToCart
);

// Update cart item quantity
cartRouter.put(
  '/cart/item/:id',
  authenticate,
  authorize(['customer']),
  validateParams(cartItemIdParamSchema),
  validateBody(updateCartItemSchema),
  updateCartItem
);

// Remove cart item
cartRouter.delete(
  '/cart/item/:id',
  authenticate,
  authorize(['customer']),
  validateParams(cartItemIdParamSchema),
  removeCartItem
);

// Get full cart with discounts applied
cartRouter.get('/cart', authenticate, authorize(['customer']), getCart);

export default cartRouter;
