"use client";
import ActionButton from "@/app/components/ActionButton";
import SectionHeader from "@/app/components/SectionHeader";
import { TOrganization } from "@/app/constants/type";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import {
  createOrganization,
  fetchOrganizations,
} from "@/app/redux/slices/orgSlice";
import OrganizationCard from "@/app/components/org_related/OrganizationCard";
import AddOrganization from "@/app/components/org_related/AddOrganization";
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/context/LoadingContext";

function Organizations() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const organizationList = useSelector(
    (state: RootState) => state.organization.organizations
  );
  const { setLoading } = useLoading();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user && user.role !== "Admin" && user.organization) {
      router.push(`organizations/${user.organization}`);
    }
  });

  // Fetch services on component mount
  useEffect(() => {
    if (user?.role === "Admin") {
      const fetchData = async () => {
        try {
          setLoading(true);
          setIsFetching(true);
          await dispatch(fetchOrganizations());
        } finally {
          setLoading(false);
          setIsFetching(false);
        }
      };
      fetchData();
    }
  }, [dispatch, setLoading, user]);

  // Open the modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle modal actions
  const handleAddOrganization = async (newOrganization: TOrganization) => {
    try {
      setLoading(true);
      const resultAction = await dispatch(createOrganization(newOrganization));
      if (createOrganization.fulfilled.match(resultAction)) {
        setIsAddModalOpen(false);
        // Refresh organizations list after successful creation
        await dispatch(fetchOrganizations());
      }
    } finally {
      setLoading(false);
    }
  };

  // Close the modals
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Handle card click to navigate to organization details
  const handleCardClick = (organization: TOrganization) => {
    router.push(`organizations/${organization._id}`);
  };

  return (
    <div className="w-full h-full pb-2 relative mx-auto px-4 overflow-auto scrollbar-hide">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="organizations" />
        <div className="w-auto">
          <ActionButton
            label="Add Organizations"
            onClick={openAddModal}
            icon="service"
          />
        </div>
      </div>
      {!isFetching && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizationList.map((organization, index) => (
            <div key={index} className="self-start">
              <OrganizationCard
                organization={organization}
                onCardClick={() => handleCardClick(organization)}
              />
            </div>
          ))}
        </div>
      )}
      {isAddModalOpen && (
        <AddOrganization
          closeAddOrganization={closeAddModal}
          onAddOrganization={handleAddOrganization}
        />
      )}
    </div>
  );
}

export default Organizations;
