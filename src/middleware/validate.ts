import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: {
          fields: fieldErrors,
          form: formErrors,
        },
      });
      return;
    }
    req.body = result.data;
    next();
  };

export const validateParams =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: {
          fields: fieldErrors,
          form: formErrors,
        },
      });
      return;
    }
    req.params = result.data;
    next();
  };
