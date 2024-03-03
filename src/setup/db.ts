import mongoose from 'mongoose';
import { logger } from '../logger/logger';
import { DBConfigSchema } from '../config';

const connectDB = async (dbConfig: DBConfigSchema) => {
  try {
    const mongo = await mongoose.connect(dbConfig.url);
    logger.info('MongoDB connected successfully');
    return mongo;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if connection fails
  }
};

export { connectDB };
