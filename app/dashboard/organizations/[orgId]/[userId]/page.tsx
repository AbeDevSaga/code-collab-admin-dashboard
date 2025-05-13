"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TUser, TService, TChatGroup, TFile, TProject, TTask } from "@/app/constants/type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import {
  deleteUser,
  fetchUserById,
  updateUser,
} from "@/app/redux/slices/userSlice";
import SectionHeader from "@/app/components/SectionHeader";
import ActionButton from "@/app/components/ActionButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import DeleteUser from "@/app/components/user_related/DeleteUser";
import UserTable from "@/app/components/user_related/UsersTable";
import { formatDate } from "@/app/utils/dateUtils";

const UserDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams() as { userId: string };
  const [user, setUser] = useState<TUser | null>(null);
  const [services, setServices] = useState<TService[]>([]);
  const [chatGroups, setChatGroups] = useState<TChatGroup[]>([]);
  const [files, setFiles] = useState<TFile[]>([]);
  const [projects, setProjects] = useState<TProject[]>([]);
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showActions, setShowActions] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

  // Open the modals
  const openUpdateModal = (user: TUser) => {
    setIsUpdateModalOpen(true);
    setSelectedUser(user);
  };
  const openDeleteModal = (user: TUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle modal actions
  const handleUpdateUser = async (updatedUser: TUser) => {
    if (selectedUser) {
      const resultAction = await dispatch(
        updateUser({
          id: selectedUser._id || "",
          userData: updatedUser,
        })
      );
      if (updateUser.fulfilled.match(resultAction)) {
        console.log("User updated successfully:", resultAction.payload);
        setIsUpdateModalOpen(false);
      } else {
        console.error("Failed to update user:", resultAction.payload);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      const resultAction = await dispatch(
        deleteUser(selectedUser._id || "")
      );
      if (deleteUser.fulfilled.match(resultAction)) {
        console.log("User deleted successfully:", resultAction.payload);
        setIsDeleteModalOpen(false);
      } else {
        console.error("Failed to delete user:", resultAction.payload);
      }
    }
  };

  // Close the modals
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          setLoading(true);
          setError(null);

          const userResponse = await dispatch(fetchUserById(userId));
          if (fetchUserById.fulfilled.match(userResponse)) {
            setUser(userResponse.payload);
            // Fetch related data (services, chat groups, files, projects, tasks)
            // Example: setServices(userResponse.payload.services);
          } else if (fetchUserById.rejected.match(userResponse)) {
            setError("Failed to fetch user data");
          }
        } catch (err) {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dispatch, userId]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle case where user data is not available
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="w-full h-full relative space-y-4 mx-auto overflow-auto scrollbar-hide">
      {/* User Details Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="absolute top-2 right-2">
          <BsThreeDotsVertical
            onClick={() => setShowActions(!showActions)}
            className="text-gray-600 cursor-pointer"
          />
        </div>
        {/* Actions */}
        {showActions && (
          <div className="absolute bg-white py-2 top-10 right-2 rounded-lg shadow-md">
            <div
              onClick={() => openUpdateModal(user)}
              className="right-2 bg-white px-4 pb-2 cursor-pointer hover:text-primary duration-300"
            >
              Update User
            </div>
            <div
              onClick={() => openDeleteModal(user)}
              className="right-2 bg-white px-4 cursor-pointer border-t border-gray-200 pt-2 hover:text-red-500 duration-300"
            >
              Delete User
            </div>
          </div>
        )}
        {/* User Name and Profile Image */}
        <div className="flex items-center space-x-4 mb-6">
          {user.profileImage && (
            <img
              src={user.profileImage}
              alt={`${user.username} Profile`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Email</h2>
            <p className="text-gray-800">{user.email}</p>
          </div>

          {/* Phone */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Phone</h2>
            <p className="text-gray-800">{user.phone || "N/A"}</p>
          </div>

          {/* Role */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Role</h2>
            <p className="text-gray-800">{user.role}</p>
          </div>

          {/* Organization */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Organization</h2>
            <p className="text-gray-800">
              {user.organization ? user.organization : "N/A"}
            </p>
          </div>

          {/* Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Status</h2>
            <p className="text-gray-800">{user.status}</p>
          </div>

          {/* Created At */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Created At</h2>
            <p className="text-gray-800">
              {user.created_at && formatDate(user.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="services" />
          <div className="w-auto">
            <ActionButton
              label="Add Service"
              onClick={() => {}}
              icon="service"
            />
          </div>
        </div>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  {service.name}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No services found.</p>
        )}
      </div>

      {/* Chat Groups Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="chat_group" />
          <div className="w-auto">
            <ActionButton
              label="Add Chat Group"
              onClick={() => {}}
              icon="chat"
            />
          </div>
        </div>
        {chatGroups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {chatGroups.map((group) => (
              <div key={group._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  {group.name}
                </h3>
                <p className="text-gray-600">{"group.description"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No chat groups found.</p>
        )}
      </div>

      {/* Files Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="files" />
          <div className="w-auto">
            <ActionButton
              label="Add File"
              onClick={() => {}}
              icon="file"
            />
          </div>
        </div>
        {files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file) => (
              <div key={file._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  {file.name}
                </h3>
                <p className="text-gray-600">{"file.description"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No files found.</p>
        )}
      </div>

      {/* Projects Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="projects" />
          <div className="w-auto">
            <ActionButton
              label="Add Project"
              onClick={() => {}}
              icon="project"
            />
          </div>
        </div>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  {project.name}
                </h3>
                <p className="text-gray-600">{"project.description"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No projects found.</p>
        )}
      </div>

      {/* Tasks Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="tasks" />
          <div className="w-auto">
            <ActionButton
              label="Add Task"
              onClick={() => {}}
              icon="task"
            />
          </div>
        </div>
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  {task.name}
                </h3>
                <p className="text-gray-600">{"task.description"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tasks found.</p>
        )}
      </div>

      {/* Modals */}
      {/* {isUpdateModalOpen && selectedUser && (
        <UpdateUser
          closeUpdateUser={closeUpdateModal}
          onUpdateUser={handleUpdateUser}
          userToUpdate={selectedUser}
        />
      )} */}
      {isDeleteModalOpen && selectedUser && (
        <DeleteUser
          user={selectedUser}
          closeDeleteUser={closeDeleteModal}
        />
      )}
    </div>
  );
};

export default UserDetailsPage;