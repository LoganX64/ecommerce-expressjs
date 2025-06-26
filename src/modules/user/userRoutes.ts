import express from 'express';
import { validateBody } from '../../middleware/validate';
import { loginUserSchema, registerUserSchema } from './userValidate';
import {
  createUser,
  deactivateUser,
  loginUser,
  resetPassword,
  updatePassword,
} from './userControllers';
import authenticate from '../../middleware/authenticate';

const userRouter = express.Router();

userRouter.post('/register', validateBody(registerUserSchema), createUser);
userRouter.post('/login', validateBody(loginUserSchema), loginUser);
// userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', authenticate, updatePassword);
userRouter.post('/deactivate', authenticate, deactivateUser);

export default userRouter;
