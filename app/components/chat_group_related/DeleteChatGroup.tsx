import { TChatGroup } from "@/app/constants/type";
import React from "react";

interface DeleteChatGroupProps {
  chatGroup: TChatGroup; // The chat group data to be deleted
  closeDeleteChatGroup: () => void; // Function to close the modal
  onDeleteChatGroup: () => void; // Function to handle chat group deletion
}

const DeleteChatGroup: React.FC<DeleteChatGroupProps> = ({
  chatGroup,
  closeDeleteChatGroup,
  onDeleteChatGroup,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="relative bg-white rounded-lg shadow-lg py-6 w-full max-w-md">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeDeleteChatGroup}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Chat Group Details */}
        <div className="flex flex-col items-center space-y-4">
          {/* Chat Group Name */}
          <h2 className="text-2xl font-semibold text-gray-800">
            {chatGroup.name || "Unnamed Chat Group"}
          </h2>

          {/* Chat Group Type */}
          <p className="text-gray-600 text-center">
            <span className="font-medium">Type:</span>{" "}
            {chatGroup.isGroupChat ? "Group Chat" : "1:1 Chat"}
          </p>

          {/* Chat Group Description */}
          {chatGroup.description && (
            <p className="text-gray-600 text-center">{chatGroup.description}</p>
          )}

          {/* Participants Count */}
          <p className="text-gray-600 text-center">
            <span className="font-medium">Participants:</span>{" "}
            {chatGroup.participants?.length || 0}
          </p>

          {/* Privacy Status */}
          {chatGroup.isGroupChat && (
            <p className="text-gray-600 text-center">
              <span className="font-medium">Privacy:</span>{" "}
              {chatGroup.isPublic ? "Public" : "Private"}
            </p>
          )}

          {/* Confirmation Message */}
          <div className="flex-col items-center space-y-4">
            <p className="text-gray-600 text-center">
              Are you sure you want to delete this {chatGroup.isGroupChat ? "group chat" : "chat"}?
              <br />
              This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex text-white space-x-2">
              {/* Cancel Button */}
              <button
                onClick={closeDeleteChatGroup}
                className="w-full text-center cursor-pointer px-4 py-2 bg-primary rounded-lg hover:text-primary hover:bg-white transition-all duration-300 border border-primary shadow-xl"
              >
                Cancel
              </button>

              {/* Delete Button */}
              <button
                onClick={onDeleteChatGroup}
                className="w-full text-center cursor-pointer px-4 py-2 bg-red-500 rounded-lg hover:text-red-500 hover:bg-white transition-all duration-300 border border-red-500 shadow-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatGroup;