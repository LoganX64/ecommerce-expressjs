import { NotificationModel } from '../modules/notification/notificationModel';
import { UserModel } from '../modules/user/userModel';

type SendNotificationOptions = {
  title: string;
  message: string;
  userIds?: string[];
  roles?: string[];
  broadcast?: boolean;
};

export const sendNotification = async ({
  title,
  message,
  userIds = [],
  roles = [],
  broadcast = false,
}: SendNotificationOptions): Promise<number> => {
  let targetUserIds: string[] = [];

  if (broadcast) {
    const users = await UserModel.find().select('_id');
    targetUserIds = users.map((u) => u._id.toString());
  } else if (roles.length > 0) {
    const users = await UserModel.find({ role: { $in: roles } }).select('_id');
    targetUserIds = users.map((u) => u._id.toString());
  } else {
    targetUserIds = userIds;
  }

  if (!targetUserIds.length) return 0;

  const notifications = targetUserIds.map((id) => ({
    userId: id,
    title,
    message,
    isRead: false,
    createdAt: new Date(),
  }));

  await NotificationModel.insertMany(notifications);
  return notifications.length;
};
