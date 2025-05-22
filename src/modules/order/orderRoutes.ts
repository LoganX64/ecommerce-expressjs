import express from 'express';
import { OrderModel } from './orderModel';
import { createOrderSchema, cancelOrderSchema, getOrderByIdSchema } from './orderValidation';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody } from '../../middleware/validate';
import { createOrder, cancelOrder, getAllOrderDetails, getOrderById } from './orderController';
const router = express.Router();

// Create order - customer only
router.post(
  '/orders',
  authenticate,
  authorize(['customer']),
  validateBody(createOrderSchema, 'body'),
  createOrder
);

// Cancel order - customer or admin, but authorization checked in controller
router.patch(
  '/orders/:orderId/cancel',
  authenticate,
  authorize(['customer', 'admin']),
  validateBody(cancelOrderSchema, 'params'),
  cancelOrder
);

// Get all orders - admin only
router.get('/orders', authenticate, authorize(['admin']), getAllOrderDetails);

// Get order by ID - customer or admin, authorization checked in controller
router.get(
  '/orders/:orderId',
  authenticate,
  authorize(['customer', 'admin']),
  validateBody(getOrderByIdSchema, 'params'),
  getOrderById
);

export default router;
