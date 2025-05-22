import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { config } from '../config/config';

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
  }

  // Mongoose: Invalid ObjectId
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Mongoose: Validation errors (from model)
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Schema validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose: Duplicate key error
  if ((err as any).code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate key error',
      keyValue: (err as any).keyValue,
    });
  }

  // App-defined error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Generic error
  return res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errorStack: config.env === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler;
