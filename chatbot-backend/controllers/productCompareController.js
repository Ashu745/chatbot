const Product = require("../models/Product");

// Utility: Clean & lowercase for loose matching
const normalize = (str) => str.toLowerCase().replace(/\s+/g, " ").trim();

// Controller to handle product comparison across stores
const compareProductAcrossStores = async (req, res) => {
  const { query } = req.body;

  // Validate the query string
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Invalid query string" });
  }

  try {
    // Normalize the product name (for loose matching)
    const productName = normalize(query);

    // Query the database to fetch all instances of the product from different stores
    const products = await Product.find({
      product_name: productName,
    });

    // If no products found
    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found in the database." });
    }

    // Group products by store and compare prices, offers, etc.
    const comparisonData = products.map((product) => ({
      store: product.store,
      price: product.price,
      discount: product.discount,
      offer: product.offers?.description || "No offers",
      offer_type: product.offers?.type || "No offer type",
      max_discount: product.offers?.max_discount || "N/A",
    }));

    // Return the comparison data for the product
    res.status(200).json({ comparison: comparisonData });
  } catch (err) {
    console.error("Comparison error:", err);
    res.status(500).json({ error: "Server error while comparing product across stores" });
  }
};

module.exports = { compareProductAcrossStores };
