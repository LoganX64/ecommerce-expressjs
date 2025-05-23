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

const customerRouter = express.Router();

customerRouter.post(
  '/customers',
  authenticate,
  authorize(['customer', 'admin', 'seller']),
  validateBody(createCustomerSchema),
  addCustomer
);

customerRouter.put(
  '/customers/:id',
  authenticate,
  authorize(['customer', 'admin', 'seller']),
  validateBody(updateCustomerSchema),

  updateCustomer
);

customerRouter.get('/customers', authenticate, authorize(['admin']), getAllCustomers);

customerRouter.get('/customers/:id', authenticate, authorize(['admin']), getCustomerById);

export default customerRouter;
