import { TToast, TUser } from "@/app/constants/type";
import { deleteUser } from "@/app/redux/slices/userSlice";
import { AppDispatch } from "@/app/redux/store";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ActionToast from "../ActionToast";

interface ViewUserProps {
  user: TUser;
  closeDeleteUser: () => void;
}

const DeleteUser: React.FC<ViewUserProps> = ({ user, closeDeleteUser }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: TToast;
  }>({ show: false, message: "", type: "info" });

  const handleDeleteUser = async () => {
    console.log("User: ", user);
    const resultAction = await dispatch(deleteUser(user._id || ""));
    if (deleteUser.fulfilled.match(resultAction)) {
      setToast({
        show: true,
        message: "User deleted successfully!",
        type: "success",
      });
    } else {
      console.log("Failed to delete user");
      setToast({
        show: true,
        message: "Failed to delete user",
        type: "error",
      });
    }
  };

  const handleToastClose = () => {
    setToast({ ...toast, show: false });
    // Only close modal if it was a success toast
    if (toast.type === "success") {
      closeDeleteUser();
    }
  };

  const getProfileImage = () => {
    if (!user.profileImage || user.profileImage.trim() === "") {
      return null; // or return a default image URL
    }
    return user.profileImage;
  };

  const profileImageSrc = getProfileImage();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="relative bg-white rounded-lg shadow-lg py-6 w-full max-w-md">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeDeleteUser}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* User Details */}
        <div className="flex flex-col items-center space-y-4">
          {/* User Image */}
          {profileImageSrc ? (
            <img
              src={profileImageSrc}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-100">
              <span className="text-2xl font-semibold text-gray-400">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* User Name */}
          <div className="flex space-x-2 items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.username}
            </h2>
            <div className="p-2 flex space-x-2 items-center">
              <p
                className={`w-2 h-2 border rounded-full ${
                  user.status === "active"
                    ? "bg-green-800"
                    : user.status === "inactive"
                    ? "bg-red-800"
                    : "bg-yellow-800"
                }`}
              ></p>
              <span
                className={`text-sm font-semibold rounded-lg ${
                  user.status === "active"
                    ? "text-green-800"
                    : user.status === "inactive"
                    ? "text-red-800"
                    : "text-yellow-800"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
          {/* User Date and Status */}
          <div className="flex-col items-center space-y-4">
            <p>Are you sure you want to delete these user</p>
            <div className="flex text-white space-x-2">
              <p
                onClick={closeDeleteUser}
                className="w-full text-center cursor-pointer px-4 py-2 bg-primary rounded-lg hover:text-primary hover:bg-white transition-all duration-300 border border-primary shadow-xl"
              >
                Cancel
              </p>
              <p
                onClick={handleDeleteUser}
                className="w-full text-center cursor-pointer px-4 py-2 bg-red-500 rounded-lg hover:text-red-500 hover:bg-white transition transition-all duration-300 border border-red-500 shadow-xl"
              >
                Delete
              </p>
            </div>
          </div>
        </div>
      </div>
      {toast.show && (
        <ActionToast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
          position="bottom" // or "top" or "center"
        />
      )}
    </div>
  );
};

export default DeleteUser;
