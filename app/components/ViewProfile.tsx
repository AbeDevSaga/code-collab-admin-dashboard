import React, { useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import { TUser } from "../constants/type";
import { FaUserAlt } from "react-icons/fa";
import { updateUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";

interface ViewUserProps {
  user: TUser;
  closeViewUser: () => void;
}

const ViewProfile: React.FC<ViewUserProps> = ({ user, closeViewUser }) => {
  const dispatch = useDispatch<AppDispatch>();
  // State for user details
  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  // State for password update
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for profile image upload
  const [profileImage, setProfileImage] = useState(user.profileImage);

  useEffect(() => {
    setProfileImage(user.profileImage);
  }, [user.profileImage]);

  // Handle updating user details
  const handleUpdateDetails = () => {
    console.log("Updating Details...");
    console.log("New Name:", name);
    console.log("New Email:", email);
    // Add logic to update user details
  };

  // Handle updating password
  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    console.log("Updating Password...");
    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);
    // Add logic to update password
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("user id: ", user._id);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        if (user._id && reader.result) {
          dispatch(
            updateUser({
              id: user._id,
              userData: { profileImage: reader.result as string },
            })
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeViewUser}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* User Details */}
        <div className="flex flex-col items-center space-y-4">
          {/* User Image with Upload Button */}
          <div className="relative w-24 h-24">
            {/* <img
              src={profileImage}
              alt={user.username}
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            /> */}
            {profileImage ? (
              <img
                src={profileImage} // This should be updated after image upload
                alt={user.username}
                className="w-full h-full rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <FaUserAlt className="w-full h-full rounded-full object-cover border-2 border-gray-200" />
            )}

            {/* Upload Button Overlay */}
            <label
              htmlFor="profileImageUpload"
              className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center border border-primary justify-center cursor-pointer shadow-lg hover:shadow-none transition-shadow duration-200 text-xl"
            >
              +
              <input
                id="profileImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* User Date and Role */}
          <div className="flex items-center space-x-3">
            <p className="px-4 py-2 text-white text-sm font-semibold rounded-full bg-primary">
              {user.created_at}
            </p>
            <span className={`px-6 py-2 text-sm font-semibold rounded-full`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="mt-6 space-y-4 mx-auto p-2 border rounded-lg">
            <h2 className="text-primary">User Details</h2>
            {/* Floating Label Input for Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Name"
              />
            </div>

            {/* Floating Label Input for Email */}
            <div className="relative mt-4">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Email"
              />
            </div>

            <ActionButton
              label="Save Changes"
              icon="update"
              onClick={handleUpdateDetails}
            />
          </div>

          <div className="mt-6 space-y-4 mx-auto p-2 border rounded-lg">
            <h2 className="text-primary">Update Password</h2>
            <div className="relative">
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Current Password"
              />
            </div>

            <div className="relative mt-4">
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="New Password"
              />
            </div>

            <div className="relative mt-4">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Confirm Password"
              />
            </div>

            <ActionButton
              label="Save Changes"
              icon="update"
              onClick={handleUpdatePassword}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
