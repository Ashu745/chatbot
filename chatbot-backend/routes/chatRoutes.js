const express = require("express");
const jwt = require("jsonwebtoken");
const {
  saveChatHistory,
  getChatHistory,
  deleteChatHistoryById,
  getRecommendedProducts, // 👈 Add import
} = require("../controllers/chatHistoryController");

const router = express.Router();

router.post("/history", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { summary, fullChat, chatId } = req.body;

    await saveChatHistory(decoded.id, summary, fullChat, chatId);
    res.status(200).json({ message: "Chat saved successfully" });
  } catch (error) {
    console.error("Error saving chat:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const history = await getChatHistory(decoded.id);
    res.status(200).json({ history });
  } catch (error) {
    console.error("Error getting chat:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/history/:chatId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await deleteChatHistoryById(decoded.id, req.params.chatId);
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🆕 Recommendation API
router.get("/recommendations", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recommendations = await getRecommendedProducts(decoded.id);
    res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
