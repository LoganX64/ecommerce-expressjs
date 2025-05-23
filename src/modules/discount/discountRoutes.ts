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

const discountRouter = express.Router();

discountRouter.post(
  '/discounts',
  authenticate,
  authorize(['seller']),
  validateBody(discountSchema),
  createDiscount
);

discountRouter.get('/discounts', authenticate, authorize(['seller', 'admin']), listDiscounts);

discountRouter.get('/discounts/:id', authenticate, authorize(['seller', 'admin']), getDiscountById);

discountRouter.put(
  '/discounts/:id',
  authenticate,
  authorize(['seller']),
  validateBody(discountSchema.partial()),
  updateDiscount
);

discountRouter.delete('/discounts/:id', authenticate, authorize(['seller']), deleteDiscount);

export default discountRouter;
