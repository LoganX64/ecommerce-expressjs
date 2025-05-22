import express from 'express';
import {
  addCustomer,
  updateCustomer,
  getAllCustomers,
  getCustomerById,
} from './customerController';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody } from '../../middleware/validate';
import { createCustomerSchema, updateCustomerSchema } from './customerValidation';

const router = express.Router();

// Add customer - any authenticated user (e.g., customer role)
router.post(
  '/customers',
  authenticate,
  authorize(['customer', 'admin', 'seller']),
  validateBody(createCustomerSchema),
  addCustomer
);

// Update customer - only owner (authenticated user), enforced inside controller by checking req.userId
router.put(
  '/customers/:id',
  authenticate,
  authorize(['customer', 'admin', 'seller']),
  validateBody(updateCustomerSchema),

  updateCustomer
);

// Get all customers - admin only
router.get('/customers', authenticate, authorize(['admin']), getAllCustomers);

// Get customer by id - admin only
router.get('/customers/:id', authenticate, authorize(['admin']), getCustomerById);

export default router;
