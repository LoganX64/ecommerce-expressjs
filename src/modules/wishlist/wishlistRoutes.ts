import express from 'express';
import { WishlistModel } from './wishlistModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await WishlistModel.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const newItem = new WishlistModel(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export default router;
