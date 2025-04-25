"use client";

import { TTask } from "@/app/constants/type";
import { FaEye, FaTrash } from "react-icons/fa";


type TaskActionsProps = {
  task: TTask;
  onView: (task: TTask) => void; // Callback for view action
  onDelete: (task: TTask) => void; // Callback for delete action
};

export const TaskActions = ({ task, onView, onDelete }: TaskActionsProps) => {
  return (
    <div className="flex space-x-6">
      {/* View Button */}
      <button
        onClick={() => onView(task)} // Trigger the onView callback
        className="text-gray-500 hover:text-blue-700"
      >
        <FaEye className="w-5 h-5" />
      </button>
      {/* Delete Button */}
      <button
        onClick={() => onDelete(task)} // Trigger the onDelete callback
        className="text-red-500 hover:text-red-700"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  );
};