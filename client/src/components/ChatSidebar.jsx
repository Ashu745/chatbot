import React from "react";

const ChatSidebar = () => {
  return (
    <div className="w-64 bg-gray-100 border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>
      <ul>
        <li className="mb-2 p-2 bg-white rounded shadow-sm cursor-pointer hover:bg-gray-200">
          Product: iPhone 14
        </li>
        <li className="mb-2 p-2 bg-white rounded shadow-sm cursor-pointer hover:bg-gray-200">
          Product: MacBook Pro
        </li>
      </ul>
    </div>
  );
};

export default ChatSidebar;
