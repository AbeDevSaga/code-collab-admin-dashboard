import React from "react";
import { TChatGroup } from "../../constants/type";
import { FaUsers, FaComment, FaLink } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { RiGroupLine } from "react-icons/ri";

interface ChatGroupCardProps {
  chatGroup: TChatGroup;
  onCardClick?: () => void;
}

const ChatGroupCard: React.FC<ChatGroupCardProps> = ({
  chatGroup,
  onCardClick,
}) => {
  return (
    <div className="bg-white relative rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full min-h-[300px]">
      {/* Chat Group Avatar and Name */}
      <div className="flex items-center mb-4">
        {chatGroup.avatar ? (
          <img
            src={chatGroup.avatar}
            alt={`${chatGroup.name} Avatar`}
            className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 border-2 border-gray-200 shadow-sm">
            {chatGroup.isGroupChat ? (
              <RiGroupLine className="w-6 h-6 text-gray-500" />
            ) : (
              <HiOutlineChatBubbleLeftRight className="w-6 h-6 text-gray-500" />
            )}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {chatGroup.name || "Unnamed Chat"}
          </h2>
          {chatGroup.isGroupChat && (
            <span className="text-xs text-gray-500">
              {chatGroup.isPublic ? "Public Group" : "Private Group"}
            </span>
          )}
        </div>
      </div>

      {/* Chat Group Description */}
      {chatGroup.description && (
        <p className="text-gray-600 mb-6 line-clamp-2">
          {chatGroup.description}
        </p>
      )}

      {/* Chat Group Stats */}
      <div className="flex space-x-6 mb-6">
        {/* Participants Count */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-full">
            <FaUsers className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">
              {chatGroup.participants?.length || 0}
            </span>
            <span className="text-sm text-gray-500">
              {chatGroup.isGroupChat ? "Members" : "Participant"}
            </span>
          </div>
        </div>

        {/* Last Activity */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-full">
            <FaComment className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">
              {chatGroup.lastMessage ? "Recent" : "No"}
            </span>
            <span className="text-sm text-gray-500">Activity</span>
          </div>
        </div>

        {/* Invitation Link Indicator */}
        {chatGroup.invitationLink && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-full">
              <FaLink className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">
                {chatGroup.invitationLinkExpires ? "Temp" : "Active"}
              </span>
              <span className="text-sm text-gray-500">Link</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Group View Button */}
      <button
        className="mt-auto w-full py-2 px-4 text-primary rounded-md hover:text-blue-600 transition-colors duration-300"
        onClick={onCardClick}
      >
        {chatGroup.isGroupChat ? "Open Group Chat" : "Open Chat"}
      </button>
    </div>
  );
};

export default ChatGroupCard;