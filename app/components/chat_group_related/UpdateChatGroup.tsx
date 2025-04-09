import React, { useState, useEffect } from "react";
import ActionButton from "../ActionButton";
import { TChatGroup } from "../../constants/type";

interface UpdateChatGroupProps {
  closeUpdateChatGroup: () => void;
  onUpdateChatGroup: (chatGroupData: TChatGroup) => void;
  chatGroupToUpdate: TChatGroup;
}

const UpdateChatGroup: React.FC<UpdateChatGroupProps> = ({
  closeUpdateChatGroup,
  onUpdateChatGroup,
  chatGroupToUpdate,
}) => {
  // State for updated chat group details
  const [name, setName] = useState<TChatGroup["name"]>(chatGroupToUpdate.name);
  const [description, setDescription] = useState(chatGroupToUpdate.description);
  const [isGroupChat, setIsGroupChat] = useState(chatGroupToUpdate.isGroupChat ?? true);
  const [isPublic, setIsPublic] = useState(chatGroupToUpdate.isPublic ?? false);
  const [avatar, setAvatar] = useState(chatGroupToUpdate.avatar);

  // Pre-fill the form with the chat group data
  useEffect(() => {
    setName(chatGroupToUpdate.name);
    setDescription(chatGroupToUpdate.description);
    setIsGroupChat(chatGroupToUpdate.isGroupChat ?? true);
    setIsPublic(chatGroupToUpdate.isPublic ?? false);
    setAvatar(chatGroupToUpdate.avatar);
  }, [chatGroupToUpdate]);

  // Handle updating the chat group
  const handleUpdateChatGroup = () => {
    const updatedChatGroup: TChatGroup = {
      ...chatGroupToUpdate, // Keep existing fields like _id, participants, etc.
      name,
      description,
      isGroupChat,
      isPublic,
      avatar,
    };

    onUpdateChatGroup(updatedChatGroup);
    closeUpdateChatGroup();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeUpdateChatGroup}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Update Chat Group Form */}
        <div className="mt-6">
          <h2 className="text-primary text-xl font-semibold mb-4">Chat Group Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Chat Group Name"
                />
              </div>

              {/* Description */}
              <div className="relative">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Description"
                  rows={3}
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {/* Chat Type */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={isGroupChat}
                    onChange={() => setIsGroupChat(true)}
                    className="mr-2"
                  />
                  Group Chat
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!isGroupChat}
                    onChange={() => setIsGroupChat(false)}
                    className="mr-2"
                  />
                  1:1 Chat
                </label>
              </div>

              {/* Privacy Setting (only for group chats) */}
              {isGroupChat && (
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="mr-2"
                    />
                    Public
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="mr-2"
                    />
                    Private
                  </label>
                </div>
              )}

              {/* Avatar */}
              <div className="relative">
                <input
                  type="url"
                  id="avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Avatar URL"
                />
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="mt-6 flex items-center justify-center">
            <ActionButton
              label={isGroupChat ? "Update Group Chat" : "Update Chat"}
              icon="chat"
              onClick={handleUpdateChatGroup}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateChatGroup;