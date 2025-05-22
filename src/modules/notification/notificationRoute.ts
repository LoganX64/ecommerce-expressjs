import express from 'express';
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from './notificationController';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody } from '../../middleware/validate';
import { notificationSchema, markAsReadSchema } from './notificationValidation';

const router = express.Router();

router.post(
  '/notifications',
  authenticate,
  authorize(['admin']),
  validateBody(notificationSchema, 'body'),
  createNotification
);

router.get(
  '/notifications',
  authenticate,
  authorize(['admin', 'seller', 'customer']),
  getUserNotifications
);

router.patch(
  '/notifications/:id/read',
  authenticate,
  authorize(['admin', 'seller', 'customer']),
  validateBody(markAsReadSchema, 'params'),
  markNotificationAsRead
);

router.delete(
  '/notifications/:id',
  authenticate,
  authorize(['admin', 'seller', 'customer']),
  deleteNotification
);

export default router;
