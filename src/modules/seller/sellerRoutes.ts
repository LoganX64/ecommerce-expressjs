import express from 'express';
import { addSeller, updateSeller, getAllSellers, getSellerById } from './sellerController';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody } from '../../middleware/validate';
import { createSellerSchema, updateSellerSchema } from './sellerValidation';

const router = express.Router();

// Add seller - any authenticated user (e.g., seller role)
router.post(
  '/sellers',
  authenticate,
  authorize(['seller', 'admin', 'customer']),
  validateBody(createSellerSchema),
  addSeller
);

// Update seller - only owner (authenticated user), enforced in controller
router.put(
  '/sellers/:id',
  authenticate,
  authorize(['seller', 'admin', 'customer']),
  validateBody(updateSellerSchema),
  updateSeller
);

// Get all sellers - admin only
router.get('/sellers', authenticate, authorize(['admin']), getAllSellers);

// Get seller by id - admin only
router.get('/sellers/:id', authenticate, authorize(['admin']), getSellerById);

export default router;
