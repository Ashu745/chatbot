const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  type: String,
  description: String,
  value_type: String,
  value: Number,
  max_discount: Number,
  conditions: String,
});

const ProductSchema = new mongoose.Schema({
  product_name: String,
  product_type: String,
  brand: String,
  price: Number,
  discount: Number,
  offers: OfferSchema,
  store: String,
});

module.exports = mongoose.model("Product", ProductSchema);
