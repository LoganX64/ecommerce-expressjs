import express from 'express';
import {
  createDiscount,
  listDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
} from './discountController';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody } from '../../middleware/validate';
import { discountSchema } from './discountValidation';

const router = express.Router();

// Create discount - seller only
router.post(
  '/discounts',
  authenticate,
  authorize(['seller']),
  validateBody(discountSchema),
  createDiscount
);

// List discounts - admin sees all, sellers see their own
router.get('/discounts', authenticate, authorize(['seller', 'admin']), listDiscounts);

// Get single discount by ID - admin or seller
router.get('/discounts/:id', authenticate, authorize(['seller', 'admin']), getDiscountById);

// Update discount - only owning seller
router.put(
  '/discounts/:id',
  authenticate,
  authorize(['seller']),
  validateBody(discountSchema.partial()),
  updateDiscount
);

// Delete discount - only owning seller
router.delete('/discounts/:id', authenticate, authorize(['seller']), deleteDiscount);

export default router;
