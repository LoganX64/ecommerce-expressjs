import { z } from 'zod';

export const notificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  userId: z.string().optional(),
  roles: z.array(z.string()).optional(),
  broadcast: z.boolean().optional(),
});

export const markAsReadSchema = z.object({
  id: z.string().min(1),
});
