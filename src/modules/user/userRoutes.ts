import express from 'express';
import { validateBody } from '../../middleware/validate';
import { loginUserSchema, registerUserSchema } from './userValidate';
import { createUser, loginUser } from './userControllers';

const userRouter = express.Router();

userRouter.post('/register', validateBody(registerUserSchema), createUser);
userRouter.post('/login', validateBody(loginUserSchema), loginUser);
// userRouter.post('/forgot-password', forgotPassword);
// userRouter.post('/reset-password', resetPassword);

export default userRouter;
