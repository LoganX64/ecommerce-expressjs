import express from 'express';

import { authorize } from '../../middleware/authorize';
import { validateBody } from '../../middleware/validate';
import { createProductSchema, updateProductSchema } from './productValidation';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
} from './productController';
import authenticate from '../../middleware/authenticate';

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize(['seller']),
  validateBody(createProductSchema),
  addProduct
);

router.put(
  '/:id',
  authenticate,
  authorize(['seller']),
  validateBody(updateProductSchema),
  updateProduct
);

router.delete('/:id', authenticate, authorize(['seller']), deleteProduct);

router.get('/:id', getProductById);

router.get('/', getAllProducts);

export default router;
