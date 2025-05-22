import express from 'express';
import { CartitemModel } from './cartItemModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await CartitemModel.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const newItem = new CartitemModel(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export default router;
