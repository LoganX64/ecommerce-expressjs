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

const notificationRouter = express.Router();

notificationRouter.post(
  '/notifications',
  authenticate,
  authorize(['admin']),
  validateBody(notificationSchema),
  createNotification
);

notificationRouter.get(
  '/notifications',
  authenticate,
  authorize(['admin', 'seller', 'customer']),
  getUserNotifications
);

notificationRouter.patch(
  '/notifications/:id/read',
  authenticate,
  authorize(['admin', 'seller', 'customer']),
  validateBody(markAsReadSchema),
  markNotificationAsRead
);

notificationRouter.delete(
  '/notifications/:id',
  authenticate,
  authorize(['admin', 'seller', 'customer']),
  deleteNotification
);

export default notificationRouter;
