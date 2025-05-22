import mongoose from 'mongoose';
import { z } from 'zod';

export const wishlistSchema = z.object({
  productId: z.string().refine((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid product ID',
  }),
});
