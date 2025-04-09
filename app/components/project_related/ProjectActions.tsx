"use client";
import { TProject } from "@/app/constants/type";
import React from "react";
import { FaEye, FaTrash } from "react-icons/fa";

interface ProjectActionsProps {
  project: TProject;
  onView: (project: TProject) => void;
  onDelete: (project: TProject) => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ project, onView, onDelete }) => {
  return (
    <div className="flex space-x-6">
      <button
        onClick={() => onView(project)}
        className="text-gray-500 hover:text-blue-700"
      >
        <FaEye className="w-5 h-5" />
      </button>
      <button
        onClick={() => onDelete(project)}
        className="text-red-500 hover:text-red-700"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProjectActions;