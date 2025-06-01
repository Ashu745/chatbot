const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const dotenv = require("dotenv");

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chatbot";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const filePath = path.join(__dirname, "../data/product_data_5000.json");
const products = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const importData = async () => {
  try {
    await Product.deleteMany(); // optional: clear previous
    await Product.insertMany(products);
    console.log("✅ Products imported successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Failed to import:", error);
    process.exit(1);
  }
};

importData();
