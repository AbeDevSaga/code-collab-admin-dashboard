"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TOrganization, TProject, TUser } from "@/app/constants/type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import {
  deleteOrganization,
  fetchOrganizationById,
  updateOrganization,
} from "@/app/redux/slices/orgSlice";
import SectionHeader from "@/app/components/SectionHeader";
import ActionButton from "@/app/components/ActionButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import UpdateOrganization from "@/app/components/org_related/UpdateOrganization";
import DeleteOrganization from "@/app/components/org_related/DeleteOrganization";
import { fetchUsersByOrganizationId } from "@/app/redux/slices/userSlice";
import UserTable from "@/app/components/user_related/UsersTable";
import AddUser from "@/app/components/user_related/AddUser";
import { useRouter } from "next/navigation";
import { fetchProjects } from "@/app/redux/slices/projectSlice";
import ProjectTable from "@/app/components/project_related/ProjectTable";

const OrganizationDetailsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { orgId } = useParams() as { orgId: string };
  const [organization, setOrganization] = useState<TOrganization | null>(null);
  const [usersList, setUserList] = useState<TUser[]>([]);
  const [projectList, setProjectList] = useState<TProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showActions, setShowActions] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<TOrganization | null>(null);
  // Open the modals
  const openAddAdminModal = () => {
    setAddAdminModalOpen(true);
  };
  const openAddUserModal = () => {
    setAddUserModalOpen(true);
  };
  const openUpdateModal = (service: TOrganization) => {
    setIsUpdateModalOpen(true);
    setSelectedOrganization(service);
  };
  const openDeleteModal = (service: TOrganization) => {
    setSelectedOrganization(service);
    setIsDeleteModalOpen(true);
  };

  // Handle modal actions
  const handleAddAdmin = (newUser: TUser) => {
    console.log("New User Data:", newUser);
    // Add admin logic here
    // const resultAction = await dispatch(createUser(newUser));
    // if (createUser.fulfilled.match(resultAction)) {
    //   console.log("User added successfully:", resultAction.payload);
    //   setIsAddUserOpen(false); // Close the modal after saving
    // } else {
    //   console.error("Failed to add user:", resultAction.payload);
    // }
    setAddAdminModalOpen(false);
  };

  const handleUpdateOrganization = async (updatedService: TOrganization) => {
    console.log("updatedOrganization: ", updatedService);
    if (selectedOrganization) {
      const resultAction = await dispatch(
        updateOrganization({
          id: selectedOrganization._id || "",
          organizationData: updatedService,
        })
      );
      if (updateOrganization.fulfilled.match(resultAction)) {
        console.log("Organization updated successfully:", resultAction.payload);
        setIsUpdateModalOpen(false);
      } else {
        console.error("Failed to update Organization:", resultAction.payload);
      }
    }
  };
  const handleDeleteOrganization = async () => {
    console.log("Deleting Organization:", selectedOrganization);
    const resultAction = await dispatch(
      deleteOrganization(selectedOrganization?._id || "")
    );
    if (deleteOrganization.fulfilled.match(resultAction)) {
      console.log("Organization deleted successfully:", resultAction.payload);
      setIsDeleteModalOpen(false);
    } else {
      console.error("Failed to delete Organization:", resultAction.payload);
    }
  };

  const handleViewUser = (user: TUser) => {
    router.push(`${orgId}/${user._id}`);
  };

  const handleViewProject = (project: TProject) => {
    router.push(`${orgId}/${project._id}`);
  };

  // Close the modals
  const closeAddAdminModal = () => {
    setAddAdminModalOpen(false);
  };
  const closeAddUserModal = () => {
    setAddUserModalOpen(false);
  };
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Fetch organization data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (orgId) {
        try {
          setLoading(true);
          setError(null);

          const orgResponse = await dispatch(fetchOrganizationById(orgId));
          if (fetchOrganizationById.fulfilled.match(orgResponse)) {
            setOrganization(orgResponse.payload);
          } else if (fetchOrganizationById.rejected.match(orgResponse)) {
            setError("Failed to fetch organization data");
          }

          const userResponse = await dispatch(
            fetchUsersByOrganizationId(orgId)
          );
          if (fetchUsersByOrganizationId.fulfilled.match(userResponse)) {
            setUserList(userResponse.payload);
          } else {
            setError("Failed to fetch user list");
          }

          const projectResponse = await dispatch(fetchProjects(orgId));
          if (fetchProjects.fulfilled.match(projectResponse)) {
            setProjectList(projectResponse.payload);
            console.log("projectList: ", projectResponse.payload);
          } else {
            setError("Failed to fetch user list");
          }
        } catch (err) {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dispatch, orgId]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle case where organization data is not available
  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="w-full h-full relative space-y-4 mx-auto overflow-auto scrollbar-hide">
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
              onClick={() =>
                openUpdateModal({
                  ...organization,
                  _id: organization._id || "",
                })
              }
              className="right-2 bg-white px-4 pb-2 cursor-pointer hover:text-primary duration-300"
            >
              Update Organization
            </div>
            <div
              onClick={() =>
                openDeleteModal({
                  ...organization,
                  _id: organization._id || "",
                })
              }
              className="right-2 bg-white px-4 cursor-pointer border-t border-gray-200 pt-2 hover:text-red-500 duration-300"
            >
              Delete Organization
            </div>
          </div>
        )}
        {/* Organization Name and Logo */}
        <div className="flex items-center space-x-4 mb-6">
          {organization.logo && (
            <img
              src={organization.logo}
              alt={`${organization.name} Logo`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-800">
            {organization.name}
          </h1>
        </div>

        {/* Organization Description */}
        {organization.description && (
          <p className="text-gray-600 mb-6">{organization.description}</p>
        )}

        {/* Organization Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Address */}
          {organization.address && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Address</h2>
              <p className="text-gray-800">{organization.address}</p>
            </div>
          )}

          {/* Phone */}
          {organization.phone && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Phone</h2>
              <p className="text-gray-800">{organization.phone}</p>
            </div>
          )}

          {/* Email */}
          {organization.email && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Email</h2>
              <p className="text-gray-800">{organization.email}</p>
            </div>
          )}

          {/* Website */}
          {organization.website && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Website</h2>
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {organization.website}
              </a>
            </div>
          )}

          {/* Super Admin */}
          {organization.superAdmin ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">
                Super Admin
              </h2>
              <p className="text-gray-800">
                {organization.superAdmin.username}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 flex items-center space-x-3 rounded-lg">
              {/* User Icon with Question Mark */}
              <div className="relative w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                {/* Question Mark */}
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                  <span className="text-xs text-white font-bold">?</span>
                </div>
              </div>

              {/* Add Super Admin Button */}
              <button
                onClick={() => openAddAdminModal()}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
              >
                <span>Add Super Admin</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Created At */}
          {organization.createdAt && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">
                Created At
              </h2>
              <p className="text-gray-800">
                {new Date(organization.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Users Section */}
      <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="users" />
          <div className="w-auto">
            <ActionButton
              label="Add Users"
              onClick={openAddUserModal}
              icon="user"
            />
          </div>
        </div>
        {usersList && usersList.length > 0 && (
          <UserTable
            onViewUser={handleViewUser}
            users={usersList}
            px="2"
            py="2"
          />
        )}
      </div>
      {/* Projects Section */}
      <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="projects" />
          <div className="w-auto">
            <ActionButton
              label="Add Project"
              onClick={openAddUserModal}
              icon="user"
            />
          </div>
        </div>
        {projectList && projectList.length > 0 && (
          <ProjectTable
            onViewProject={handleViewProject}
            projects={projectList}
            px="2"
            py="2"
          />
        )}
      </div>

      {addAdminModalOpen && (
        <AddUser
          closeAddUser={closeAddAdminModal}
          onAddUser={handleAddAdmin}
          orgId={orgId}
          role="Super Admin"
        />
      )}
      {isUpdateModalOpen && selectedOrganization && (
        <UpdateOrganization
          closeUpdateOrganization={closeUpdateModal}
          onUpdateOrganization={handleUpdateOrganization}
          organizationToUpdate={selectedOrganization}
        />
      )}
      {isDeleteModalOpen && selectedOrganization && (
        <DeleteOrganization
          organization={selectedOrganization}
          closeDeleteOrganization={closeDeleteModal}
          onDeleteOrganization={handleDeleteOrganization}
        />
      )}
    </div>
  );
};

export default OrganizationDetailsPage;
