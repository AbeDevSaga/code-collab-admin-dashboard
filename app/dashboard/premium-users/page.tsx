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
import { useLoading } from "@/app/context/LoadingContext";

function PremiumUsers() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { setLoading } = useLoading();
  const usersList = useSelector((state: RootState) => state.user.premiumUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // State to control the modal
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setIsFetching(true);
        await dispatch(fetchPremiumUsers());
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchData();
  }, [dispatch, setLoading]);

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
    try {
      setLoading(true);
      const resultAction = await dispatch(createUser(newUser));
      if (createUser.fulfilled.match(resultAction)) {
        setIsAddUserOpen(false);
        // Refresh premium users list after successful creation
        await dispatch(fetchPremiumUsers());
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
          role="Premuim User"
        />
      )}
    </div>
  );
}

export default PremiumUsers;
