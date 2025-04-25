"use client";
import ActionButton from "@/app/components/ActionButton";
import SectionHeader from "@/app/components/SectionHeader";
import UserTable from "@/app/components/user_related/UsersTable";
import React, { useEffect, useState } from "react";
import { createUser, fetchAllUsers } from "@/app/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { TUser } from "@/app/constants/type";
import { useRouter } from "next/navigation";
import CreateUser from "@/app/components/user_related/CreateUser";
import { useLoading } from "@/app/context/LoadingContext";

function users() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const usersList = useSelector((state: RootState) => state.user.users);
  const { setLoading } = useLoading();
  const [isFetching, setIsFetching] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // State to control the modal

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setIsFetching(true);
        await dispatch(fetchAllUsers());
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchUsers();
  }, [dispatch, setLoading]);

  // Function to handle the Add User button click
  const handleAddUser = () => {
    console.log("Opening Add User modal...");
    setIsAddUserOpen(true); // Open the modal
  };
  const handleCloseAddUser = () => {
    setIsAddUserOpen(false); // Close the modal
  };

  const handleViewUser = (user: TUser) => {
    router.push(`users/${user._id}`);
  };

  const handleSaveUser = async (newUser: TUser) => {
    try {
      setLoading(true);
      const resultAction = await dispatch(createUser(newUser));
      if (createUser.fulfilled.match(resultAction)) {
        setIsAddUserOpen(false);
      }
    } finally {
      setLoading(false);
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
      {!isFetching && (
        <UserTable
          onViewUser={handleViewUser}
          users={usersList}
          px="4"
          py="4"
        />
      )}
      {isAddUserOpen && (
        <CreateUser
          closeAddUser={handleCloseAddUser}
          onAddUser={handleSaveUser}
          role="User"
        />
      )}
    </div>
  );
}

export default users;
