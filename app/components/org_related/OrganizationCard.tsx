import React from "react";
import { TOrganization } from "../../constants/type";
import { FaUsers, FaProjectDiagram } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

interface OrganizationCardProps {
  organization: TOrganization;
  onCardClick?: () => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onCardClick,
}) => {
  return (
    <div className="bg-white relative rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full min-h-[300px]">
      {/* Organization Logo and Name */}
      <div className="flex items-center mb-4">
        {organization.logo ? (
          <img
            src={organization.logo}
            alt={`${organization.name} Logo`}
            className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 border-2 border-gray-200 shadow-sm">
            <HiOutlineBuildingOffice2 className="w-6 h-6 text-gray-500" />
          </div>
        )}
        <h2 className="text-xl font-semibold text-gray-800">
          {organization.name}
        </h2>
      </div>

      {/* Organization Description */}
      {organization.description && (
        <p className="text-gray-600 mb-6 line-clamp-2">
          {organization.description}
        </p>
      )}

      {/* Organization Stats */}
      <div className="flex space-x-6 mb-6">
        {/* Users Count */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-full">
            <FaUsers className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">{organization.users?.length}</span>
            <span className="text-sm text-gray-500">Users</span>
          </div>
        </div>

        {/* Projects Count */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-full">
            <FaProjectDiagram className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">{organization.projects?.length}</span>
            <span className="text-sm text-gray-500">Projects</span>
          </div>
        </div>
      </div>

      {/* Organization View Button */}
      <button
        className="mt-auto w-full py-2 px-4 text-primary rounded-md hover:text-blue-600 transition-colors duration-300"
        onClick={onCardClick}
      >
        View Organization
      </button>
    </div>
  );
};

export default OrganizationCard;
