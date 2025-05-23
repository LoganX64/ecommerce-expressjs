import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async () => {
  try {
    if (!config.databaseUrl) {
      throw new Error('Database URL is not defined in config');
    }

    await mongoose.connect(config.databaseUrl);

    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
  } catch (err) {
    console.error('Initial DB connection failed:', err);
    process.exit(1);
  }
};

export default connectDB;
