"use client";
import { TProject } from "@/app/constants/type";
import React from "react";

interface DeleteProjectProps {
  project: TProject;
  closeDeleteProject: () => void;
}

const DeleteProject: React.FC<DeleteProjectProps> = ({ project, closeDeleteProject }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="relative bg-white rounded-lg shadow-lg py-6 w-full max-w-md">
        {/* Close Button and content similar to DeleteUser */}
        {/* ... */}
      </div>
    </div>
  );
};

export default DeleteProject;