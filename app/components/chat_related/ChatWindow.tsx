"use client";
import { TMessage } from "@/app/constants/type";
import { RootState, AppDispatch } from "@/app/redux/store";
import { formatDate } from "@/app/utils/dateUtils";
import React from "react";
import { useSelector } from "react-redux";

interface ChatWindowProps {
  messages: TMessage[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex items-end ${
              message.sender._id === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender._id !== user?._id  && (
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex justify-center items-center mr-2">
                {message.sender.profileImage ? (
                  <img
                    src={message.sender.profileImage}
                    alt={message.sender.username.charAt(0)}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  message.sender.username.charAt(0)
                )}
              </div>
            )}

            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.sender._id === user?._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className="text-xs text-right">
                {message.createdAt ? formatDate(message.createdAt) : "Invalid date"}
              </div>
            </div>

            {message.sender._id === user?._id && (
              <div className="w-8 h-8 rounded-full bg-blue-300 text-white flex justify-center items-center ml-2">
                {message.sender.profileImage ? (
                  <img
                    src={message.sender.profileImage}
                    alt={message.sender.username.charAt(0)}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  "YOU"
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
