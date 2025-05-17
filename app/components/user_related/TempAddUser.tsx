import { StaticImageData } from "next/image";
import React, { useState } from "react";
import ActionButton from "../ActionButton";
import { TUser } from "@/app/constants/type";
import OrganizationUsers from "../org_related/OrganizationUsers";
import CloseButton from "../CloseButton";

interface AddUserProps {
  projectId?: string;
  orgId?: string;
  users: TUser[];
  closeAddUser: () => void; // Callback to close the modal
  onAddUser: (userData: TUser) => void; // Callback to add a new user
}

const AddUser: React.FC<AddUserProps> = ({
  projectId,
  orgId,
  users,
  closeAddUser,
  onAddUser,
}) => {
  // Handle adding a new user
  const handleAddUser = () => {
    closeAddUser(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative space-y-4 mx-auto overflow-auto scrollbar-hide">
        <div className="p-6 overflow-hidden relative bg-white rounded-lg shadow-md">
          <CloseButton closeModal={closeAddUser} /> 
          <OrganizationUsers
            onViewUser={() => {}} 
            onAddUser={onAddUser} 
            users={users} // Pass the users prop to display the list of users
            height="h-[80vh]" // Height for the modal content
            section="add_user" // Section name for styling or identification
            px="px-4" // Padding for the modal content
            py="py-4" // Padding for the modal content
          />
        </div>
      </div>
    </div>
  );
};

export default AddUser;
