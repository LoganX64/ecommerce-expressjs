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

const productRouter = express.Router();

productRouter.post(
  '/',
  authenticate,
  authorize(['seller']),
  validateBody(createProductSchema),
  addProduct
);

productRouter.put(
  '/:id',
  authenticate,
  authorize(['seller']),
  validateBody(updateProductSchema),
  updateProduct
);

productRouter.delete('/:id', authenticate, authorize(['seller']), deleteProduct);

productRouter.get('/:id', getProductById);

productRouter.get('/', getAllProducts);

export default productRouter;
