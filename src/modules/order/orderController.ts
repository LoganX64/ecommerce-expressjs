import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { OrderModel } from './orderModel';
import type { AuthRequest } from '../../middleware/authenticate';
import { AppError } from '../../utils/AppError';
import { applyDiscount } from '../../utils/applyDiscount';
import { CartModel } from '../cart/cartModel';
import { CartItemModel } from '../cartItem/cartItemModel';
import { OrderitemModel } from '../orderItem/orderItemModel';
import { DiscountModel } from '../discount/discountModel';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'customer') {
      throw new AppError('Only customers can create orders', 403);
    }

    const customerId = req.userId;
    const cart = await CartModel.findOne({ customerId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const cartItems = await CartItemModel.find({ cartId: cart._id }).populate('productId');
    if (!cartItems.length) {
      throw new AppError('Cart is empty', 400);
    }

    const productIds = cartItems.map((item) => item.productId._id);
    const categoryIds = cartItems
      .map((item) => {
        const product = item.productId;
        if (typeof product === 'object' && 'categoryId' in product) {
          return product.categoryId;
        }
        return null;
      })
      .filter((id): id is mongoose.Types.ObjectId => id !== null);

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

    let totalPrice = 0;
    let discountAmount = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product: any = item.productId;
      let finalPrice = product.price;

      const applicableDiscount = discounts.find((discount) => {
        return (
          discount.applicableProducts?.some((id) => id.equals(product._id)) ||
          discount.applicableCategories?.some((id) => id.equals(product.categoryId))
        );
      });

      if (applicableDiscount) {
        const discounted = applyDiscount({
          originalPrice: product.price,
          value: applicableDiscount.value,
          valueType: applicableDiscount.valueType,
        });
        discountAmount += product.price - discounted;
        finalPrice = discounted;
      }

      totalPrice += finalPrice * item.quantity;

      orderItems.push({
        orderId: undefined,
        productId: product._id,
        quantity: item.quantity,
        price: finalPrice,
      });
    }

    const order = await OrderModel.create({
      customerId,
      totalPrice,
      discountAmount,
      status: 'pending',
      orderDate: new Date(),
      shippingId: req.body.shippingId,
      notes: req.body.notes || '',
    });

    await OrderitemModel.insertMany(orderItems.map((item) => ({ ...item, orderId: order._id })));

    await CartItemModel.deleteMany({ cartId: cart._id });
    await CartModel.deleteOne({ _id: cart._id });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid order ID', 400);
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (req.userRole === 'customer' && order.customerId.toString() !== req.userId) {
      throw new AppError('Not authorized to cancel this order', 403);
    }

    if (order.status === 'cancelled') {
      res.status(400).json({ success: false, message: 'Order already cancelled' });
      return;
    }
    if (order.status === 'delivered') {
      res
        .status(400)
        .json({ success: false, message: 'Order already delivered and cannot be cancelled' });
      return;
    }

    order.status = 'cancelled';
    order.updated = new Date();

    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getAllOrderDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.userRole !== 'admin') {
      throw new AppError('Only admins can access all orders', 403);
    }

    const orders = await OrderModel.find().sort({ orderDate: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid order ID', 400);
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (req.userRole === 'customer' && order.customerId.toString() !== req.userId) {
      throw new AppError('Not authorized to view this order', 403);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
