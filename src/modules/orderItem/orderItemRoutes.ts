import express from 'express';
import { OrderitemModel } from './orderItemModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await OrderitemModel.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const newItem = new OrderitemModel(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export default router;
