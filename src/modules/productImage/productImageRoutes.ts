import express from 'express';
import { ProductimageModel } from './productImageModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await ProductimageModel.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const newItem = new ProductimageModel(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export default router;
