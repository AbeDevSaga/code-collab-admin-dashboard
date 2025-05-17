import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  TFile,
  TOrganization,
  TProject,
  TUser,
  TTeamMember,
} from "../../constants/type";
import { readFileAsBase64 } from "@/app/utils/fileUtils";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";

interface AddProjectProps {
  closeAddProject: () => void;
  onAddProject: (newProject: TProject) => void;
  organization?: string;
  users?: TUser[];
}
const AddProject: React.FC<AddProjectProps> = ({
  closeAddProject,
  onAddProject,
  organization,
  users = [],
}) => {
  const [newProject, setNewProject] = useState<TProject>({
    name: "",
    description: "",
    status: "active",
    createdBy: {} as TUser,
    organization: organization as unknown as TOrganization,
    files: [],
    teamMembers: [],
  });

  const [files, setFiles] = useState<TFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<TTeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState)=>state.auth.user)

  useEffect(() => {
    if (user) {
      setSelectedUsers([{
        user,
        role: "Admin", // or whatever default role you want for the creator
        addedAt: new Date(),
      }]);
      setNewProject(prev => ({ ...prev, createdBy: user }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      try {
        const newFiles = await Promise.all(
          Array.from(e.target.files).map(async (file) => {
            const content = await readFileAsBase64(file);
            return {
              name: file.name,
              type: "document",
              path: "/uploads",
              extension: file.name.split(".").pop() || "",
              size: file.size,
              content: content,
              organization: (organization as unknown as TOrganization) || {}, // Ensure organization is included
            };
          })
        );
        setFiles((prev) => [...prev, ...newFiles]);
      } catch (error) {
        console.error("Error reading files:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleUserSelection = (user: TUser) => {
    setSelectedUsers((prev) => {
      const existingIndex = prev.findIndex(
        (member) => member.user._id === user._id
      );
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [
          ...prev,
          {
            user,
            role: "Developer", // default role
            addedAt: new Date(),
          },
        ];
      }
    });
  };

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectToSubmit = {
        ...newProject,
        files: files,
        teamMembers: selectedUsers,
        organization: organization,
      };
      onAddProject(projectToSubmit);
      closeAddProject();
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Project Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newProject.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Files
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    {isUploading
                      ? "Uploading..."
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, XLS, JPG, PNG up to 10MB
                  </p>
                </div>

                {/* File Preview */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Attached Files
                    </h4>
                    <ul className="divide-y divide-gray-200">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="py-2 flex items-center justify-between"
                        >
                          <div className="flex items-center min-w-0">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                              {file.type?.startsWith("image/") ? (
                                <img
                                  src={file.path}
                                  alt={file.name}
                                  className="h-8 w-8 object-contain"
                                />
                              ) : (
                                <span className="text-gray-500 text-xs">
                                  {file.extension?.toUpperCase() || "FILE"}
                                </span>
                              )}
                            </div>
                            <div className="ml-3 overflow-hidden">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size ? file.size / 1024 : 0).toFixed(1)}{" "}
                                KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - User Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Team Members
                </label>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleUserSearch}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md mb-2"
                />
                <div className="border border-gray-200 rounded-md h-64 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <li key={user._id} className="p-2 hover:bg-gray-50">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedUsers.some(
                                (member) => member.user._id === user._id
                              )}
                              onChange={() => toggleUserSelection(user)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <div className="flex items-center">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage}
                                  alt={user.username}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
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
                              </div>
                            </div>
                          </label>
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

              {/* Selected Members Preview */}
              {selectedUsers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Team Members ({selectedUsers.length})
                  </h4>
                  <div className="border border-gray-200 rounded-md p-3 max-h-48 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                        >
                          {member.user.profileImage ? (
                            <img
                              src={member.user.profileImage}
                              alt={member.user.username}
                              className="h-6 w-6 rounded-full mr-2"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                              <span className="text-gray-600 text-xs">
                                {member.user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-700 mr-2">
                            {member.user.username}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleUserSelection(member.user)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              className="h-4 w-4"
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={closeAddProject}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
