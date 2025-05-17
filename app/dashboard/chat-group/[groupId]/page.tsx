"use client";
import ChatSidebar from "@/app/components/chat_related/ChatSideBar";
import ChatTab from "@/app/components/chat_related/ChatTab";
import ChatWindow from "@/app/components/chat_related/ChatWindow";
import MessageBox from "@/app/components/chat_related/MessageBox";
import { TMessage, TUser } from "@/app/constants/type";
import { fetchChatById } from "@/app/redux/slices/chatGroupSlice";
import {
  fetchMessages,
  markMessageAsRead,
  sendMessage,
} from "@/app/redux/slices/messageSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChatGroup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading, error } = useSelector(
    (state: RootState) => state.messages
  );
  const { currentChat } = useSelector((state: RootState) => state.chatGroup);

  const { groupId } = useParams() as { groupId: string };
  const [showSidebar, setShowSidebar] = useState(false);
  const [members, setMembers] = useState<TUser[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const chatId = groupId? groupId : "defaultChatId";

  useEffect(() => {
    if (currentChat?.participants) {
      const formattedMembers = currentChat.participants.map(participant => ({
        _id: participant.user._id,
        username: participant.user.username,
        email: participant.user.email,
        role: participant.role, // Using the role from participant section
        profileImage: participant.user.profileImage,
        status: participant.status
      }));
      setMembers(formattedMembers);
    }
  }, [currentChat]);

  const handleSendMessage = (message: TMessage) => {
    // console.log("sending message: ", message)
    dispatch(sendMessage({ message }));
  };

  const handleMarkAsRead = (messageId: string) => {
    dispatch(markMessageAsRead(messageId));
  };

  // Fetch Chat Group and Message on component mount
  useEffect(() => {
    dispatch(fetchChatById(chatId))
    .unwrap()
      .then((data) => {
        console.log("Chats Group successfully:", data);
      })
      .catch((error) => {
        console.error("Failed to fetch Chat Groups:", error);
      });
    dispatch(fetchMessages({chatId}))
      .unwrap()
      .then((data) => {
        console.log("Chats fetched successfully:", data);
      })
      .catch((error) => {
        console.error("Failed to fetch messeges:", error);
      });
  }, [dispatch]);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="w-full h-20 flex-shrink-0 flex items-center justify-between border-b">
        <ChatTab name={currentChat?.name || ""} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <ChatWindow messages={Object.values(messages).flat()} />
          <div className="p-4 border-t">
            {user && (
              <MessageBox
                onSend={handleSendMessage}
                chatId={chatId || ""}
                sender={user}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="h-full w-64 bg-gray-100 border-l shadow-lg flex-shrink-0 overflow-y-auto">
            <ChatSidebar members={members} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGroup;
