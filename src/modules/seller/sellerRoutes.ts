import express from 'express';
import { addSeller, updateSeller, getAllSellers, getSellerById } from './sellerController';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody } from '../../middleware/validate';
import { createSellerSchema, updateSellerSchema } from './sellerValidation';

const sellerRouter = express.Router();

sellerRouter.post(
  '/sellers',
  authenticate,
  authorize(['seller', 'admin', 'customer']),
  validateBody(createSellerSchema),
  addSeller
);

sellerRouter.put(
  '/sellers/:id',
  authenticate,
  authorize(['seller', 'admin', 'customer']),
  validateBody(updateSellerSchema),
  updateSeller
);

sellerRouter.get('/sellers', authenticate, authorize(['admin']), getAllSellers);

sellerRouter.get('/sellers/:id', authenticate, authorize(['admin']), getSellerById);

export default sellerRouter;
