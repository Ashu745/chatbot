const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// 🔍 Endpoint: Search products based on query
router.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
    const products = await Product.find({
      $or: [
        { product_name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});


router.post("/compare", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    const products = await Product.find({
      product_name: { $regex: new RegExp(query, "i") },
    });

    res.json({ results: products });
  } catch (err) {
    console.error("Comparison failed:", err);
    res.status(500).json({ error: "Comparison failed" });
  }
});


module.exports = router;
