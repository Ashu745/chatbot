const mongoose = require('mongoose');

// MongoDB connection string (update db name here)
const mongoURI = 'mongodb://localhost:27017/chatbot'; // Use your actual DB name

// Create a function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit process if DB fails
  }
};

module.exports = connectDB;
