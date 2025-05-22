import express from 'express';
import { RegistrationModel } from './registrationModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await RegistrationModel.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const newItem = new RegistrationModel(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export default router;
