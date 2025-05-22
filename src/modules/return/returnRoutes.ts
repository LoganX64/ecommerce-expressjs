import express from 'express';
import { ReturnModel } from './returnModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await ReturnModel.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const newItem = new ReturnModel(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export default router;
