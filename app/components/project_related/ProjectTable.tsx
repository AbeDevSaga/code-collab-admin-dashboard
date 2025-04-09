"use client";
import React, { useState } from "react";
import Pagination from "../Pagination";
import DeleteProject from "./DeleteProject";
import ProjectActions from "./ProjectActions";
import { TProject } from "@/app/constants/type";
import StatusBadge from "../user_related/StatusBadge";

interface ProjectTableProps {
  onViewProject: (projectData: TProject) => void;
  projects: TProject[];
  px: string;
  py: string;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  onViewProject,
  projects,
  px,
  py,
}) => {
  const [deletedProject, setDeletedProject] = useState<TProject | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const handleView = (project: TProject) => {
    onViewProject(project);
  };

  const handleDelete = (project: TProject) => {
    setDeletedProject(project);
  };

  const closeDeleteProject = () => {
    setDeletedProject(null);
  };

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(projects.length / projectsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      {deletedProject && (
        <DeleteProject
          project={deletedProject}
          closeDeleteProject={closeDeleteProject}
        />
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-sidebarcolor">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Project Name
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Created By
              </th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Dates
              </th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Label
              </th>
              <th className="hidden xl:table-cell px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProjects.map((project) => (
              <tr key={project._id}>
                <td
                  className={`px-${px} py-${py} whitespace-nowrap text-sm font-medium`}
                >
                  {project.name}
                </td>
                <td
                  className={`hidden md:table-cell px-${px} py-${py} whitespace-nowrap text-sm`}
                >
                  {project.createdBy?.username || "-"}
                </td>
                <td
                  className={`hidden lg:table-cell px-${px} py-${py} whitespace-nowrap text-sm`}
                >
                  <div className="flex flex-col">
                    <span>Start: {formatDate(project.startDate)}</span>
                    <span>End: {formatDate(project.endDate)}</span>
                  </div>
                </td>
                <td
                  className={`hidden sm:table-cell px-${px} py-${py} whitespace-nowrap text-sm`}
                >
                  {project.labels?.[0] ?? "-"}
                </td>
                <td className="hidden xl:table-cell px-2 py-2 whitespace-nowrap">
                  <StatusBadge status={project.status || "active"} />
                </td>
                <td className="px-6 py-4 flex items-center justify-center whitespace-nowrap text-sm">
                  <ProjectActions
                    project={project}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(projects.length / projectsPerPage)}
        onPageChange={paginate}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  );
};

export default ProjectTable;
