import mongoose from 'mongoose';
import { IWishlist } from './wishlistType';

const wishlistSchema = new mongoose.Schema<IWishlist>({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  addedDate: { type: Date, required: true },
});

export const WishlistModel = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
