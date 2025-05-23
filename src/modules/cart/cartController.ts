import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { cartItemSchema } from '../cartItem/cartItemValidate';
import { CartModel } from './cartModel';
import { AuthRequest } from '../../middleware/authenticate';
import { CartItemModel } from '../cartItem/cartItemModel';
import { applyDiscount } from '../../utils/applyDiscount';
import { DiscountModel } from '../discount/discountModel';
import { IProduct } from '../product/productType';
import { AppError } from '../../utils/AppError';

export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'customer') {
      throw new AppError('Only customers can add to cart', 403);
    }
    if (!req.userId) {
      throw new AppError('User not authenticated', 401);
    }

    const { productId, quantity } = cartItemSchema.parse(req.body);

    let cart = await CartModel.findOne({ customerId: req.userId });
    if (!cart) {
      cart = new CartModel({ customerId: req.userId });
      await cart.save();
    }

    const existingItem = await CartItemModel.findOne({
      cartId: cart._id,
      productId,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.lastUpdated = new Date();
      await existingItem.save();
      res.status(200).json({ success: true, data: existingItem });
      return;
    }

    const newCartItem = new CartItemModel({
      cartId: cart._id,
      productId,
      quantity,
      lastUpdated: new Date(),
    });
    await newCartItem.save();

    res.status(201).json({ success: true, data: newCartItem });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'customer') {
      throw new AppError('Only customers can update cart items', 403);
    }
    if (!req.userId) {
      throw new AppError('User not authenticated', 401);
    }

    const cartItemId = req.params.id;
    if (!mongoose.isValidObjectId(cartItemId)) {
      throw new AppError('Invalid cart item ID', 400);
    }

    const { quantity } = z.object({ quantity: z.number().int().min(1) }).parse(req.body);

    const cart = await CartModel.findOne({ customerId: req.userId });
    if (!cart) {
      throw new AppError('Cart not found for user', 404);
    }

    const cartItem = await CartItemModel.findOne({ _id: cartItemId, cartId: cart._id });
    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    cartItem.quantity = quantity;
    cartItem.lastUpdated = new Date();
    await cartItem.save();

    res.status(200).json({ success: true, data: cartItem });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'customer') {
      throw new AppError('Only customers can remove cart items', 403);
    }
    if (!req.userId) {
      throw new AppError('User not authenticated', 401);
    }

    const cartItemId = req.params.id;
    if (!mongoose.isValidObjectId(cartItemId)) {
      throw new AppError('Invalid cart item ID', 400);
    }

    const cart = await CartModel.findOne({ customerId: req.userId });
    if (!cart) {
      throw new AppError('Cart not found for user', 404);
    }

    const cartItem = await CartItemModel.findOne({ _id: cartItemId, cartId: cart._id });
    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    await cartItem.deleteOne();

    res.status(200).json({ success: true, message: 'Cart item removed' });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'customer') {
      throw new AppError('Only customers can view cart', 403);
    }
    if (!req.userId) {
      throw new AppError('User not authenticated', 401);
    }

    const cart = await CartModel.findOne({ customerId: req.userId });
    if (!cart) {
      res.status(200).json({ success: true, data: { items: [] } });
      return;
    }

    const cartItems = await CartItemModel.find({ cartId: cart._id }).populate('productId');
    if (!cartItems.length) {
      res.status(200).json({ success: true, data: { cart, items: [] } });
      return;
    }

    const productIds = cartItems
      .map((item) =>
        item.productId && 'price' in item.productId ? (item.productId as IProduct)._id : null
      )
      .filter((id): id is mongoose.Types.ObjectId => id !== null);

    const categoryIds = cartItems
      .map((item) =>
        item.productId && 'categoryId' in item.productId
          ? (item.productId as IProduct).categoryId
          : null
      )
      .filter((id): id is mongoose.Types.ObjectId => id !== null);

    // Check active discount
    const discounts = await DiscountModel.find({
      active: true,
      startDate: { $lte: new Date() },
      $and: [
        {
          $or: [
            { applicableProducts: { $in: productIds } },
            { applicableCategories: { $in: categoryIds } },
          ],
        },
        {
          $or: [{ endDate: null }, { endDate: { $gte: new Date() } }],
        },
      ],
    });

    const enrichedItems = await Promise.all(
      cartItems.map(async (item) => {
        if (!item.productId || !(item.productId as any).price) {
          return {
            ...item.toObject(),
            product: null,
            error: 'Product not found or not populated',
          };
        }

        const product = item.productId as IProduct;

        const originalPrice = product.price;
        let discountedPrice = originalPrice;

        // apply discount
        const applicableDiscount = discounts.find((discount) => {
          const hasProduct = (discount.applicableProducts ?? []).some(
            (id: mongoose.Types.ObjectId) => id.equals(product._id!)
          );
          const hasCategory = (discount.applicableCategories ?? []).some(
            (id: mongoose.Types.ObjectId) => id.equals(product.categoryId)
          );
          return hasProduct || hasCategory;
        });

        if (applicableDiscount) {
          discountedPrice = applyDiscount({
            originalPrice,
            value: applicableDiscount.value,
            valueType: applicableDiscount.valueType,
          });
        }

        return {
          ...item.toObject(),
          product: {
            ...product,
            originalPrice,
            discountedPrice,
            discountApplied: !!applicableDiscount,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        cart,
        items: enrichedItems,
      },
    });
  } catch (error) {
    next(error);
  }
};
