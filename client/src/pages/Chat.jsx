import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaTrash, FaBars } from "react-icons/fa";
import { FiX, FiPlus } from "react-icons/fi";

const Chat = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [firstValidProduct, setFirstValidProduct] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(true);

  const deletedChatId = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const saveChatToBackend = async (summary, fullChat, chatId = null) => {
    if (chatId && deletedChatId.current === chatId) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/api/chat/history`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ summary, fullChat, chatId }),
      });
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const deleteChat = async (chatId) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/api/chat/history/${chatId}`, {

        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
      if (activeChatId === chatId) {
        setMessages([]);
        setFirstValidProduct(null);
        setActiveChatId(null);
      }
      deletedChatId.current = chatId;
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const token = localStorage.getItem("token");

    try {

      const nlpResponse = await fetch(`${BASE_URL.replace(":5000", ":5001")}/api/nlp`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      const nlpData = await nlpResponse.json();
      console.log("NLP response:", nlpData);

      const productResults = nlpData.results || [];

      if (!productResults.length) {
        setMessages((prev) => [
          ...prev.filter((m) => !m.isGreeting),
          { text: input, sender: "user" },
          { text: "Sorry, no matching product found.", sender: "bot" },
        ]);
        setInput("");
        return;
      }

      if (!firstValidProduct && productResults[0]?.product_name) {
        setFirstValidProduct(productResults[0].product_name);
      }

      const cardBg = darkMode ? "bg-gray-700" : "bg-white";
      const textColor = darkMode ? "text-white" : "text-black";
      const containerBg = darkMode ? "bg-gray-800" : "bg-gray-100";

      const formatted = `
      <div class="w-full flex flex-wrap justify-evenly gap-3 ${containerBg} ${textColor} p-2 rounded-lg shadow my-2 text-sm leading-tight">
        ${productResults
          .map(
            (product) => `
              <div class="flex-1 min-w-[220px] max-w-[260px] ${cardBg} ${textColor} p-2 rounded-md shadow border">
                <p><strong>📦 Product:</strong> ${product.product_name || "N/A"}</p>
                <p><strong>🛍️ Store:</strong> ${product.store || "N/A"}</p>
                <p><strong>💰 Price:</strong> ₹${product.price || "N/A"}</p>
                <p><strong>🔖 Discount:</strong> ${product.discount || 0}%</p>
                <p><strong>🎁 Offer:</strong> ${product.offers?.description || "N/A"}</p>
              </div>
            `
          )
          .join("")}
      </div>
    `;

      const cheapest = productResults.reduce((a, b) => (a.price < b.price ? a : b));
      const discountedPrice = Math.round(
        cheapest.price - (cheapest.price * (cheapest.discount || 0)) / 100
      );
      const bestDealMessage = `
      <div class="p-2 mt-2 rounded bg-green-100 border border-green-400 text-xs text-green-800 leading-tight">
        ✅ <strong>Best Deal:</strong> ${cheapest.product_name} at <strong>₹${discountedPrice}</strong> on <strong>${cheapest.store} (incl Discount)</strong>.<br/>
        ${cheapest.offers?.description ? `💳 <em>${cheapest.offers.description}</em>` : ""}
      </div>
    `;

      setMessages((prev) => [
        ...prev.filter((m) => !m.isGreeting), // ⛔ remove greeting if present
        { text: input, sender: "user" },
        { text: formatted, sender: "bot", isHtml: true },
        { text: bestDealMessage, sender: "bot", isHtml: true },
      ]);
    } catch (error) {
      console.error("Compare error:", error.message);
      setMessages((prev) => [
        ...prev.filter((m) => !m.isGreeting), // ⛔ remove greeting if present
        { text: input, sender: "user" },
        { text: "Sorry, something went wrong.", sender: "bot" },
      ]);
    }

    setInput("");
  };





  const handleNewChat = async () => {
    if (messages.length > 0 && firstValidProduct) {
      const summary = `Comparing ${firstValidProduct}`;
      const newId = Date.now();
      const updated = [
        { id: newId, summary, fullChat: messages },
        ...chatHistory.filter((chat) => chat.id !== activeChatId),
      ];
      setChatHistory(updated);
      await saveChatToBackend(summary, messages, activeChatId || newId);
    }

    const greetings = [
      "Hi there! 👋 What would you like to compare today?",
      "Welcome! 🚀 Type a product name to get started.",
      "Hey! 😊 Let’s find you the best deal.",
      "Hello! 🛍️ What product are you looking for?",
      "Ready to compare prices? 🔍 Type your product below!"
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    setMessages([{ text: randomGreeting, sender: "bot", isGreeting: true }]);
    setFirstValidProduct(null);
    setActiveChatId(null);
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    setChatHistory([]);
    navigate("/");
  };
  // const fetchRecommendation = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   try {
  //     const response = await fetch("http://localhost:5000/api/chat/recommendation", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await response.json();
  //     if (response.ok && data.recommendation) {
  //       setRecommendation(data.recommendation);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching recommendation:", error);
  //   }
  // };

  const loadChatFromHistory = async (chat) => {
    if (
      messages.length > 0 &&
      firstValidProduct &&
      !chatHistory.some((c) => JSON.stringify(c.fullChat) === JSON.stringify(messages))
    ) {
      const summary = `Comparing ${firstValidProduct}`;
      const newId = Date.now();
      const updated = [
        { id: newId, summary, fullChat: messages },
        ...chatHistory.filter((c) => c.id !== activeChatId),
      ];
      setChatHistory(updated);
      await saveChatToBackend(summary, messages, activeChatId || newId);
    }

    setMessages(chat.fullChat);
    setActiveChatId(chat.id);

    const firstComparison = chat.fullChat.find((m) => m.isHtml && m.text.includes("📦"));
    if (firstComparison) {
      const match = firstComparison.text.match(/<strong>Product:<\/strong>\s*([^<]+)/);
      if (match && match[1]) setFirstValidProduct(match[1].trim());
    } else {
      setFirstValidProduct(null);
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${BASE_URL}/api/chat/history`, {

          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok && data.history.length) {
          setChatHistory(data.history);
          fetchRecommendation(); // Add this at the end of fetchChatHistory function after setting chatHistory

        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (

    <div className={`flex h-screen w-screen ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      {recommendation && showRecommendation && (
        <div className="bg-yellow-100 border border-yellow-400 p-2 text-sm text-yellow-800 rounded flex justify-between items-center m-4 shadow">
          <span>🔥 Recommended for you: {recommendation}</span>
          <button
            onClick={() => setShowRecommendation(false)}
            className="ml-4 text-yellow-900 hover:text-yellow-600 font-bold"
          >
            ✖
          </button>
        </div>
      )}

      <div
        className={`flex flex-col h-full border-r  space-y-2 transition-all duration-500 ease-in-out transform
    ${darkMode ? "bg-[#202123] text-white" : "bg-gray-100"}
    ${showSidebar ? "w-64 opacity-100 p-4 translate-x-0" : "w-0 opacity-0 -translate-x-full overflow-hidden"}
  `}
      >

        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setShowSidebar(false)}
            className={`${darkMode ? "text-white" : "text-gray-800"} p-1 hover:bg-gray-300 rounded transition`}
          >
            <FiX size={20} />
          </button>

          <button onClick={handleNewChat} className="p-1 text-white bg-green-600 rounded hover:bg-green-700">
            <FiPlus size={18} />
          </button>
        </div>
        <h2 className="text-lg font-semibold">Chat History</h2>
        <div className="flex-1 overflow-y-auto space-y-1">
          {chatHistory.length === 0 ? (
            <div className="text-gray-400">No chat history available.</div>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer text-sm ${activeChatId === chat.id
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                <span onClick={() => loadChatFromHistory(chat)} className="flex-1 truncate">{chat.summary}</span>
                <FaTrash
                  onClick={() => deleteChat(chat.id)}
                  className="ml-2 text-xs text-red-500 hover:text-red-700"
                />
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded bg-yellow-500 text-white hover:bg-yellow-600">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>


      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? "bg-[#202123] text-white" : "bg-gray-100"}`}>
          <div className="flex items-center gap-2">
            {!showSidebar && (
              <>
                <button onClick={() => setShowSidebar(true)} className="text-xl p-1 rounded hover:bg-gray-600 transition">
                  <FaBars size={18} />
                </button>
                <button onClick={handleNewChat} className="text-green-600 hover:text-green-800 transition">
                  <FiPlus size={18} />
                </button>
              </>
            )}
            <h1 className="ml-4 text-lg font-semibold">Chatbot</h1>
          </div>
          <div>
            <div
              onClick={handleLogout}
              className="cursor-pointer rounded-full w-8 h-8 bg-blue-500 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-600 transition"
              title="Logout"
            >
              {localStorage.getItem("token")?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.isHtml ? (
                <div
                  className={`w-full ${msg.sender === "user" ? "flex justify-end" : ""}`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ) : (
                <div className={`max-w-xl rounded-lg px-4 py-2 whitespace-pre-wrap ${msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200"
                  }`}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}

        </div>

        <div className={`p-4 border-t ${darkMode ? "bg-[#343541]" : "bg-gray-100"} flex`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me to compare a product..."
            className={`flex-1 p-3 rounded-lg border ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
          />
          <button
            onClick={handleSend}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
