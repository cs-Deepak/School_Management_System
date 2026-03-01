/**
 * MongoDB Connection Setup
 *
 * Connects to MongoDB using Mongoose
 * Handles connection events and graceful shutdown
 */

const mongoose = require('mongoose');
const logger = require('./logger');

let signalsBound = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: false,                 // Disable auto-indexing in production
      serverSelectionTimeoutMS: 5000,   // Fail fast if MongoDB is unreachable
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Bind shutdown signals only once
    if (!signalsBound) {
      signalsBound = true;

      const gracefulShutdown = async (signal) => {
        try {
          logger.info(`Received ${signal}. Closing MongoDB connection...`);
          await mongoose.connection.close();
          logger.info('MongoDB connection closed');
          process.exit(0);
        } catch (err) {
          logger.error('Error during MongoDB shutdown', err);
          process.exit(1);
        }
      };

      process.on('SIGINT', gracefulShutdown);
      process.on('SIGTERM', gracefulShutdown);
    }

  } catch (error) {
    logger.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;