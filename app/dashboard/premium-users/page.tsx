"use client";
import ActionButton from "@/app/components/ActionButton";
import AddUser from "@/app/components/user_related/AddUser";
import SectionHeader from "@/app/components/SectionHeader";
import UserTable from "@/app/components/user_related/UsersTable";
import React, { useEffect, useState } from "react";
import { createUser, fetchPremiumUsers } from "@/app/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { TUser } from "@/app/constants/type";
import { useRouter } from "next/navigation";
import CreateUser from "@/app/components/user_related/CreateUser";

function PremiumUsers() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const usersList = useSelector((state: RootState) => state.user.premiumUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // State to control the modal

  useEffect(() => {
    dispatch(fetchPremiumUsers());
  }, [dispatch]);

  const handleAddUser = () => {
    console.log("Opening Add User modal...");
    setIsAddUserOpen(true); // Open the modal
  };
  const handleViewUser = (user: TUser) => {
    router.push(`premium-users/${user._id}`);
  };
  const handleCloseAddUser = () => {
    setIsAddUserOpen(false); // Close the modal
  };

  const handleSaveUser = async (newUser: TUser) => {
    console.log("New User Data:", newUser);
    const resultAction = await dispatch(createUser(newUser));
    if (createUser.fulfilled.match(resultAction)) {
      console.log("User added successfully:", resultAction.payload);
      setIsAddUserOpen(false); // Close the modal after saving
    } else {
      console.error("Failed to add user:", resultAction.payload);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden relative">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="users" />
        <div className="w-auto">
          <ActionButton
            label="Add User"
            onClick={handleAddUser}
            icon="add_user"
          />
        </div>
      </div>
      <UserTable onViewUser={handleViewUser} users={usersList} px="4" py="4" />
      {isAddUserOpen && (
        <CreateUser
          closeAddUser={handleCloseAddUser}
          onAddUser={handleSaveUser}
          role="Premuim User"
        />
      )}
    </div>
  );
}

export default PremiumUsers;
