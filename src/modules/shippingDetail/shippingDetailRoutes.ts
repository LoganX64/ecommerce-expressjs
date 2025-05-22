import express from 'express';
import { ShippingdetailModel } from './shippingDetailModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await ShippingdetailModel.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const newItem = new ShippingdetailModel(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export default router;
