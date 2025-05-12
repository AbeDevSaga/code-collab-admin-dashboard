"use client";
import ChatSidebar from "@/app/components/chat_related/ChatSideBar";
import ChatTab from "@/app/components/chat_related/ChatTab";
import ChatWindow from "@/app/components/chat_related/ChatWindow";
import MessageBox from "@/app/components/chat_related/MessageBox";
import { TMessage, TUser } from "@/app/constants/type";
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

  const { groupId } = useParams() as { groupId: string };
  const [showSidebar, setShowSidebar] = useState(false);
  const [members, setMembers] = useState<TUser[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const chatId = groupId? groupId : "defaultChatId";

  const handleSendMessage = (message: TMessage) => {
    // console.log("sending message: ", message)
    dispatch(sendMessage({ message }));
  };

  const handleMarkAsRead = (messageId: string) => {
    dispatch(markMessageAsRead(messageId));
  };

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchMessages({chatId}))
      .unwrap()
      .then((data) => {
        console.log("Chats fetched successfully:", data);
      })
      .catch((error) => {
        console.error("Failed to fetch messeges:", error);
      });
  }, [dispatch]);

  // useEffect(() => {
  //   if (projects && projects.length > 0) {
  //     const allStudents = projects
  //       .flatMap((project) => project.students || [])
  //       .filter(
  //         (student, index, self) =>
  //           student?._id &&
  //           index === self.findIndex((s) => s?._id === student._id) &&
  //           student._id !== user?._id
  //       ) as TUser[];
  //     const advisors = projects
  //       .flatMap((project) => project.advisor || [])
  //       .filter(
  //         (advisor, index, self) =>
  //           advisor?._id &&
  //           index === self.findIndex((s) => s?._id === advisor._id) &&
  //           advisor._id !== user?._id
  //       ) as TUser[];
  //     const members = [...allStudents, ...advisors].filter(
  //       (member, index, self) =>
  //         index === self.findIndex((m) => m._id === member._id)
  //     );

  //     setMembers(members);
  //   }
  // }, [projects]);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="w-full h-20 flex-shrink-0 flex items-center justify-between border-b">
        <ChatTab toggleSidebar={toggleSidebar} />
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
