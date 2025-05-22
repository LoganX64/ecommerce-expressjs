import express from 'express';
import { RazorpaypaymentModel } from './razorpayPaymentModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await RazorpaypaymentModel.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const newItem = new RazorpaypaymentModel(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export default router;
