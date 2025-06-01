const mongoose = require('mongoose');

// ✅ Updated: MongoDB connection string with specific DB name (e.g., chatbotdb)
const mongoURI = 'mongodb+srv://asirbad865:OGflfXyiD2u55UaZ@chatbot.ercidyc.mongodb.net/chatbotdb?retryWrites=true&w=majority&appName=Chatbot';

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
