const mongoose = require('mongoose');

// ✅ Updated: MongoDB connection string with specific DB name (e.g., chatbotdb)
const mongoURI = process.env.MONGO_URI;

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
