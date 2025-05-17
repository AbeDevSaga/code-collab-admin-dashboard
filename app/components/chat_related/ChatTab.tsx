"use client";
import React from "react";

interface ChatTabsProps {
  toggleSidebar: () => void;
  name: string;
}

const ChatTab: React.FC<ChatTabsProps> = ({ toggleSidebar, name }) => {
  return (
    <div className="flex items-center justify-between w-full px-2 py-2 border-b">
      <div className="flex space-x-2">Chat Group For {name}</div>

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
