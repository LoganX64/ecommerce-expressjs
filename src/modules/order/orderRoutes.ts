import express from 'express';

import { createOrderSchema, cancelOrderSchema, getOrderByIdSchema } from './orderValidation';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody } from '../../middleware/validate';
import { createOrder, cancelOrder, getAllOrderDetails, getOrderById } from './orderController';

const orderRouter = express.Router();

orderRouter.post(
  '/orders',
  authenticate,
  authorize(['customer']),
  validateBody(createOrderSchema),
  createOrder
);

orderRouter.patch(
  '/orders/:orderId/cancel',
  authenticate,
  authorize(['customer', 'admin']),
  validateBody(cancelOrderSchema),
  cancelOrder
);

orderRouter.get('/orders', authenticate, authorize(['admin']), getAllOrderDetails);

orderRouter.get(
  '/orders/:orderId',
  authenticate,
  authorize(['customer', 'admin']),
  validateBody(getOrderByIdSchema),
  getOrderById
);

export default orderRouter;
