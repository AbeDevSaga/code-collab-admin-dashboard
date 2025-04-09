import React, { useState } from "react";
import ActionButton from "../ActionButton";
import { TChatGroup } from "../../constants/type";

interface AddChatGroupProps {
  closeAddChatGroup: () => void;
  onAddChatGroup: (chatGroupData: TChatGroup) => void;
}

const AddChatGroup: React.FC<AddChatGroupProps> = ({
  closeAddChatGroup,
  onAddChatGroup,
}) => {
  const [name, setName] = useState<TChatGroup["name"]>("");
  const [description, setDescription] = useState<TChatGroup["description"]>("");
  const [isGroupChat, setIsGroupChat] = useState<TChatGroup["isGroupChat"]>(true);
  const [isPublic, setIsPublic] = useState<TChatGroup["isPublic"]>(false);
  const [avatar, setAvatar] = useState<TChatGroup["avatar"]>("");

  const handleAddChatGroup = () => {
    const newChatGroup: TChatGroup = {
      name,
      description,
      isGroupChat,
      isPublic,
      avatar,
      participants: [], // Initialize with empty array
    };

    onAddChatGroup(newChatGroup);
    closeAddChatGroup();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeAddChatGroup}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Add Chat Group Form */}
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
                  required
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

              {/* Privacy Setting */}
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

          {/* Add Button */}
          <div className="mt-6 flex items-center justify-center">
            <ActionButton
              label={isGroupChat ? "Create Group Chat" : "Create Chat"}
              icon="chat"
              onClick={handleAddChatGroup}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChatGroup;