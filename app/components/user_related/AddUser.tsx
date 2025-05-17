import React, { ChangeEvent, useState } from "react";
import { TUser, TTeamMember } from "../../constants/type";

interface AddUserProps {
  closeAddUser: () => void;
  onAddUser: (users: TTeamMember[]) => void; // Changed to accept array of team members
  users: TUser[];
  projectId: string;
}

const AddUser: React.FC<AddUserProps> = ({
  closeAddUser,
  onAddUser,
  users,
  projectId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<TTeamMember[]>([]);
  const [roleInputs, setRoleInputs] = useState<Record<string, string>>({});

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleUserSelection = (user: TUser) => {
    setSelectedUsers((prev) => {
      const existingIndex = prev.findIndex(
        (member) => member.user._id === user._id
      );
      
      if (existingIndex >= 0) {
        // Remove user if already selected
        const updatedRoleInputs = {...roleInputs};
        delete updatedRoleInputs[user._id || ""];
        setRoleInputs(updatedRoleInputs);
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // Add user with default role
        setRoleInputs(prev => ({
          ...prev,
          [user._id || ""]: "Developer" // Default role
        }));
        return [
          ...prev,
          {
            user,
            role: "Developer" as TTeamMember["role"],
            addedAt: new Date().toISOString(),
            _id: "", // Will be assigned by backend
          },
        ];
      }
    });
  };

  const handleRoleChange = (userId: string, role: string) => {
    setRoleInputs(prev => ({
      ...prev,
      [userId]: role
    }));
    
    setSelectedUsers(prev => 
      prev.map(member => 
        member.user._id === userId
          ? { ...member, role: role as TTeamMember["role"] }
          : member
      )
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    // Pass all selected users with their roles at once
    onAddUser(selectedUsers);
    closeAddUser();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add Users to Project</h2>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleUserSearch}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* User List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Users
            </label>
            <div className="border border-gray-200 rounded-md h-64 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <li key={user._id} className="p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-3 cursor-pointer flex-grow">
                          <input
                            type="checkbox"
                            checked={selectedUsers.some(
                              (member) => member.user._id === user._id
                            )}
                            onChange={() => toggleUserSelection(user)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <div className="flex items-center flex-grow">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.username}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-sm">
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {user.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                              {user.role && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                  {user.role}
                                </span>
                              )}
                            </div>
                          </div>
                        </label>

                        {/* Role Selector (visible when user is selected) */}
                        {selectedUsers.some(m => m.user._id === user._id) && (
                          <select
                            value={roleInputs[user._id || ""] || "Developer"}
                            onChange={(e) => handleRoleChange(user._id || "", e.target.value)}
                            className="ml-2 p-1 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="Admin">Project Manager</option>
                            <option value="Developer">Developer</option>
                            <option value="Member">Team Member</option>
                          </select>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-4 text-sm text-gray-500 text-center">
                  No users found
                </p>
              )}
            </div>
          </div>

          {/* Selected Users Preview */}
          {selectedUsers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Selected Users ({selectedUsers.length})
              </h4>
              <div className="border border-gray-200 rounded-md max-h-32 overflow-y-auto p-3">
                <ul className="space-y-2">
                  {selectedUsers.map((member, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        {member.user.profileImage ? (
                          <img
                            src={member.user.profileImage}
                            alt={member.user.username}
                            className="h-8 w-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500 text-xs">
                              {member.user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {member.user.username}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 mr-2">
                              Role:
                            </span>
                            <span className="text-xs font-medium text-blue-600">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleUserSelection(member.user)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            type="button"
            onClick={closeAddUser}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={selectedUsers.length === 0}
          >
            Add Selected Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;