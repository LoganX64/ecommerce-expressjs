import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { sendResetEmail } from '../../utils/sendEmail';

import bcrypt from 'bcrypt';
import { UserModel } from './userModel';
import { AppError } from '../../utils/AppError';
import { generateTokens } from '../../utils/generateToken';
import { AuthRequest } from '../../middleware/authenticate';

const SALT_ROUNDS = 10;

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, userRole } = req.body;

    if (!email || !password || !userRole) {
      throw new AppError('Email, password, and userRole are required', 400);
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      userRole,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser._id,
        email: newUser.email,
        userRole: newUser.userRole,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.userRole);

    // Save refreshToken in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          userRole: user.userRole,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Current and new passwords are required', 400);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Forget and reset Password test code

// export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email } = req.body;
//     const user = await UserModel.findOne({ email });

//     if (!user) throw new AppError('User not found', 404);

//     const token = crypto.randomBytes(32).toString('hex');
//     const hash = crypto.createHash('sha256').update(token).digest('hex');

//     user.resetPasswordToken = hash;
//     user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
//     await user.save();

//     const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;
//     await sendResetEmail(email, resetLink);

//     res.status(200).json({ message: 'Reset link sent to your email' });
//   } catch (error) {
//     next(error);
//   }
// };

// export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email, token, newPassword } = req.body;

//     const user = await UserModel.findOne({ email });
//     if (!user || !user.resetPasswordToken || !user.resetPasswordExpires)
//       throw new AppError('Invalid or expired reset link', 400);

//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//     if (user.resetPasswordToken !== hashedToken || user.resetPasswordExpires < new Date()) {
//       throw new AppError('Invalid or expired reset link', 400);
//     }

//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedNewPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     res.status(200).json({ message: 'Password has been reset successfully' });
//   } catch (error) {
//     next(error);
//   }
// };
const deactivateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    // Update isDeleted to true
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User account has been deactivated',
    });
  } catch (error) {
    next(error);
  }
};

export { createUser, loginUser, updatePassword };
