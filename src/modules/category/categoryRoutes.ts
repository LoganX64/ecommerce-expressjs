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

const router = express.Router();

// Public route - get all active categories (no auth)
router.get('/', getAllCategories);

// Admin-only routes
router.post('/', authenticate, authorize(['admin']), validateBody(categorySchema), addCategory);

router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  validateBody(categoryUpdateSchema),
  updateCategory
);

router.delete('/:id', authenticate, authorize(['admin']), deleteCategory);

export default router;
