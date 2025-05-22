import express from 'express';
import { PaymentModel } from './paymentModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await PaymentModel.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const newItem = new PaymentModel(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export default router;
