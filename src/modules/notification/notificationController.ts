import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/authenticate';
import { NotificationModel } from './notificationModel';
import { notificationSchema, markAsReadSchema } from './notificationValidation';
import { AppError } from '../../utils/AppError';
import { sendNotification } from '../../utils/sendNotification';

// Create notification (Admin or System trigger)
export const createNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validated = notificationSchema.parse(req.body);
    const { title, message, userId, roles, broadcast } = validated;

    const count = await sendNotification({
      title,
      message,
      userIds: userId ? [userId] : [],
      roles,
      broadcast,
    });

    res.status(201).json({ success: true, message: `${count} notification(s) sent.` });
  } catch (error) {
    next(error);
  }
};

// Get notifications for current user
export const getUserNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new AppError('Unauthorized', 401);

    const notifications = await NotificationModel.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = markAsReadSchema.parse(req.params);
    if (!req.userId) throw new AppError('Unauthorized', 401);

    const notification = await NotificationModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) throw new AppError('Notification not found', 404);

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// Delete notification (soft or hard depending on design)
export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!req.userId) throw new AppError('Unauthorized', 401);
    if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid notification ID', 400);

    const deleted = await NotificationModel.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deleted) throw new AppError('Notification not found', 404);

    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};
