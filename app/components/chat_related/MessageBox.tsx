"use client";
import { TMessage, TUser } from "@/app/constants/type";
import { url } from "inspector";
import React, { useRef, useState } from "react";
import { FaPaperclip } from 'react-icons/fa';

interface TypeMessageInputProps {
  onSend: (message: TMessage) => void;
  sender: TUser;
  chatId: string;
}

const MessageBox: React.FC<TypeMessageInputProps> = ({
  onSend,
  sender,
  chatId,
}) => {
  const [messageContent, setMessageContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const newMessage: TMessage = {
        sender: sender,
        content: file.name,
        createdAt: new Date(),
        chat: chatId,
        // attachments: [
        //   url= file.name
        //   type="file",
        //   name=file.name,
        // ],
      };
      onSend(newMessage);
    }
    if (e.target) e.target.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    
  }

  const handleSend = () => {
    if (!messageContent.trim()) return;

    const newMessage: TMessage = {
      sender: sender,
      content: messageContent,
      createdAt: new Date(),
      chat: chatId,
    };

    onSend(newMessage);
    setMessageContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center p-4 border-t bg-white">
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*, .pdf, .doc, .docx, .txt" 
        />
        <button
          type="button"
          onClick={handleFileUploadClick}
          className="p-2 text-gray-600 hover:text-blue-500 focus:outline-none"
        >
          <FaPaperclip size={20} />
        </button>
        {selectedFile && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            1
          </span>
        )}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSend}
        disabled={!messageContent.trim()}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
};

export default MessageBox;
