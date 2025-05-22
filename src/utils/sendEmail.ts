// utils/sendEmail.ts
import nodemailer from 'nodemailer';
import { config } from '../config/config';

export const sendResetEmail = async (email: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.emailuser,
      pass: config.emailpass,
    },
  });

  await transporter.sendMail({
    from: '"Your App" <your-email@gmail.com>',
    to: email,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click the link below:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>This link is valid for 1 hour only.</p>`,
  });
};
