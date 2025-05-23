import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { config } from '../config/config';

const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Zod validation error
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  // Mongoose: Invalid ObjectId
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
    return;
  }

  // Mongoose: Validation errors (from model)
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: 'Schema validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
    });
    return;
  }

  // Mongoose: Duplicate key error
  if ((err as any).code === 11000) {
    res.status(400).json({
      success: false,
      message: 'Duplicate key error',
      keyValue: (err as any).keyValue,
    });
    return;
  }

  // App-defined error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Generic error
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errorStack: config.env === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler;
