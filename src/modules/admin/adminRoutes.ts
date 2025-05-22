import express from 'express';
import { AdminModel } from './adminModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await AdminModel.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const newItem = new AdminModel(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export default router;
