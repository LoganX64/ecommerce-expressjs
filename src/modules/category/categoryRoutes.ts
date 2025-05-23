import express from 'express';
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from './categoryController';
import authenticate from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateBody } from '../../middleware/validate';
import { categorySchema, categoryUpdateSchema } from './categoryValidation';

const categoryRouter = express.Router();

categoryRouter.get('/', getAllCategories);

categoryRouter.post(
  '/',
  authenticate,
  authorize(['admin']),
  validateBody(categorySchema),
  addCategory
);

categoryRouter.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  validateBody(categoryUpdateSchema),
  updateCategory
);

categoryRouter.delete('/:id', authenticate, authorize(['admin']), deleteCategory);

export default categoryRouter;
