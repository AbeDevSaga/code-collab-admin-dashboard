"use client";
import React from "react";

interface ChatTabsProps {
  toggleSidebar: () => void;
}

const ChatTab: React.FC<ChatTabsProps> = ({ toggleSidebar }) => {
  return (
    <div className="flex items-center justify-between w-full px-2 py-2 border-b">
      <div className="flex space-x-2">"Chat Window"</div>

      {/* Toggle button at right end */}
      <button
        onClick={toggleSidebar}
        className="text-2xl px-4 focus:outline-none"
      >
        ☰
      </button>
    </div>
  );
};

export default ChatTab;
