
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI_TEST || process.env.MONGO_URI;
    if (!uri) throw new Error('MongoDB URI not set');
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (process.env.NODE_ENV !== 'test') process.exit(1);
    else throw error;
  }
};

module.exports = connectDB;