"use client";
import ActionButton from "@/app/components/ActionButton";
import SectionHeader from "@/app/components/SectionHeader";
import { TChatGroup } from "@/app/constants/type";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import {
  createChat,
  fetchAllChats,
} from "@/app/redux/slices/chatGroupSlice";
import { useRouter } from "next/navigation";
import ChatGroupCard from "@/app/components/chat_group_related/ChatGroupCard";
import AddChatGroup from "@/app/components/chat_group_related/AddChatGroup";

function ChatGroup() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const chatGroupList = useSelector(
    (state: RootState) => state.chatGroup.chats
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch chat groups on component mount
  useEffect(() => {
    console.log("Fetching chat groups...");
    dispatch(fetchAllChats());
  }, [dispatch]);

  // Open the modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle adding new chat group
  const handleAddChatGroup = async (newChatGroup: TChatGroup) => {
    console.log("Creating new chat group...", newChatGroup);
    const resultAction = await dispatch(createChat(newChatGroup));
    if (createChat.fulfilled.match(resultAction)) {
      console.log("Chat group created successfully:", resultAction.payload);
      setIsAddModalOpen(false);
    } else {
      console.error("Failed to create chat group:", resultAction.payload);
    }
  };

  // Close the modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Handle card click to navigate to chat group details
  const handleCardClick = (chatGroup: TChatGroup) => {
    router.push(`chat-group/${chatGroup._id}`);
  };

  return (
    <div className="w-full h-full pb-2 relative mx-auto px-4 overflow-auto scrollbar-hide">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="chat_group" />
        <div className="w-auto">
          <ActionButton
            label="Add Chat Group"
            onClick={openAddModal}
            icon="chat"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatGroupList.map((chatGroup, index) => (
          <div key={index} className="self-start">
            <ChatGroupCard
              chatGroup={chatGroup}
              onCardClick={() => handleCardClick(chatGroup)}
            />
          </div>
        ))}
      </div>
      {isAddModalOpen && (
        <AddChatGroup
          closeAddChatGroup={closeAddModal}
          onAddChatGroup={handleAddChatGroup}
        />
      )}
    </div>
  );
}

export default ChatGroup;