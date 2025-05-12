
import { TUser } from '@/app/constants/type';
import React from 'react';

interface ChatSidebarProps {
  members: TUser[];
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ members }) => {
  return (
    <div className="space-y-0 ">
      {members.map((member) => (
        <div
          key={member._id}
          className="flex items-center p-3 cursor-pointer hover:bg-gray-200 rounded-md"
        >
          <div className="flex justify-center items-center w-10 h-10 rounded-full bg-blue-500 text-white text-lg">
            {member.profileImage ? (
              <img
                src={member.profileImage}
                alt={member.username}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              member.username.charAt(0)
            )}
          </div>

          <div className="ml-2 flex-1">
            <div className="font-serif">{member.username}</div>
            <div className="text-sm text-gray-600">{member.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;