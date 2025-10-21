const mongoose = require('mongoose');

let inMemoryServer = null;

const connectDB = async () => {
  const mongoUriFromEnv = process.env.MONGO_URI;
  try {
    if (mongoUriFromEnv) {
      const conn = await mongoose.connect(mongoUriFromEnv, {});
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    }
    throw new Error('MONGO_URI not provided');
  } catch (err) {
    console.error('MongoDB connection error or missing MONGO_URI, attempting in-memory server...', err.message || err);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      inMemoryServer = await MongoMemoryServer.create();
      const uri = inMemoryServer.getUri('virtual_classroom');
      const conn = await mongoose.connect(uri, {});
      console.log(`Using in-memory MongoDB at ${uri}`);
      return;
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
