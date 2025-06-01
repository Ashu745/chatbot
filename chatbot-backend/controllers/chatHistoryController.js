const ChatHistory = require("../models/chatHistory");

const saveChatHistory = async (userId, summary, fullChat, chatId = null) => {
  if (!userId || !summary || !Array.isArray(fullChat)) return;

  const newChat = { id: chatId || Date.now(), summary, fullChat };

  let chatHistory = await ChatHistory.findOne({ userId });
  if (!chatHistory) {
    chatHistory = new ChatHistory({ userId, history: [newChat] });
  } else {
    chatHistory.history = chatHistory.history.filter((c) => c.id !== newChat.id);
    chatHistory.history.push(newChat);
  }

  await chatHistory.save();
};

const getChatHistory = async (userId) => {
  const chat = await ChatHistory.findOne({ userId }).lean();
  return chat?.history || [];
};

const deleteChatHistoryById = async (userId, chatId) => {
  const chatHistory = await ChatHistory.findOne({ userId });
  if (chatHistory) {
    chatHistory.history = chatHistory.history.filter((chat) => chat.id.toString() !== chatId);
    await chatHistory.save();
  }
};

// 🆕 Recommendation logic
const getRecommendedProducts = async (userId) => {
  const chat = await ChatHistory.findOne({ userId }).lean();
  if (!chat || !chat.history.length) return [];

  const productNames = chat.history
    .flatMap((h) =>
      h.fullChat
        .filter((msg) => msg.isHtml && msg.text.includes("📦"))
        .map((msg) => {
          const match = msg.text.match(/<strong>Product:<\/strong>\s*([^<]+)/);
          return match ? match[1].trim() : null;
        })
        .filter(Boolean)
    );

  const frequency = {};
  productNames.forEach((name) => {
    frequency[name] = (frequency[name] || 0) + 1;
  });

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  return sorted.slice(0, 5);
};

module.exports = {
  saveChatHistory,
  getChatHistory,
  deleteChatHistoryById,
  getRecommendedProducts, // export it
};
