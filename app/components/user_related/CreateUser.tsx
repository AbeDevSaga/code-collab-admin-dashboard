import { StaticImageData } from "next/image";
import React, { useState } from "react";
import ActionButton from "../ActionButton";
import { TUser } from "@/app/constants/type";

interface CreateUserProps {
  projectId?: string;
  orgId?: string; 
  role?: string;
  closeAddUser: () => void; // Callback to close the modal
  onAddUser: (userData: TUser) => void; // Callback to add a new user
}

const CreateUser: React.FC<CreateUserProps> = ({
  orgId,
  role,
  closeAddUser,
  onAddUser,
}) => {
  // State for new user details
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const buttonLabel = role ? `Add ${role}` : "Add User";
  const headerText = role ? `Create New ${role} Account`: "Create New User Account";

  // Handle adding a new user
  const handleAddUser = () => {
    if (password !== confirmPassword) {
      alert("Password and confirm password do not match!");
      return;
    }

    // Create a new user object
    const newUser: TUser = {
      username,
      email,
      phone,
      password,
      created_at: new Date().toLocaleDateString(), // Set the current date as the registration date
    };

    // Add organization ID only if it is provided
    if (orgId) {
      newUser.organization = orgId;
    }
    if (role) {
      newUser.role = role;
    }

    onAddUser(newUser); // Pass the new user data to the parent component
    closeAddUser(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-auto">
        <div className="flex items-center justify-center px-4">
          <p className="text-primary text-lg">{headerText}</p>
        </div>
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeAddUser}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Add User Form */}
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="space-y-4 w-full mx-auto p-2 border rounded-lg">
            <h2 className="text-primary">User Details</h2>
            {/* Floating Label Input for Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
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

            {/* Floating Label Input for Phone */}
            <div className="relative mt-4">
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Phone"
              />
            </div>
          </div>

          <div className="space-y-4 w-full mx-auto p-2 border rounded-lg">
            <h2 className="text-primary">Set Password</h2>
            {/* Floating Label Input for Password */}
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Password"
              />
            </div>

            {/* Floating Label Input for Confirm Password */}
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

            {/* Add User Button */}
            <ActionButton
              label={buttonLabel}
              icon="add_user"
              onClick={handleAddUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
