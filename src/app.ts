import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import globalErrorHandler from './middleware/globalErrorHandler';
import userRouter from './modules/user/userRoutes';
import sellerRouter from './modules/seller/sellerRoutes';
import customerRouter from './modules/customer/customerRoutes';
import orderRouter from './modules/order/orderRoutes';
import wishlistRouter from './modules/wishlist/wishlistRoutes';
import productRouter from './modules/product/productRoutes';
import discountRouter from './modules/discount/discountRoutes';
import reviewRouter from './modules/review/reviewRoutes';
import notificationRouter from './modules/notification/notificationRoute';
import categoryRouter from './modules/category/categoryRoutes';
import cartRouter from './modules/cart/cartRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONT_END_DOMAIN || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (_req, res) => {
  res.json('Ecommerce Backend is running...');
});

// all routes
app.use('/api/users', userRouter);

app.use('/api/seller', sellerRouter);

app.use('api/customer', customerRouter);

app.use('api/order', orderRouter);

app.use('api/wishlist', wishlistRouter);

app.use('api/product', productRouter);

app.use('api/discount', discountRouter);

app.use('api/review', reviewRouter);

app.use('api/notification', notificationRouter);

app.use('api/category', categoryRouter);

app.use('api/cart', cartRouter);

app.use(globalErrorHandler);

export default app;
