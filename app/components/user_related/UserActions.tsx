"use client";

import { TUser } from "@/app/constants/type";
import { FaEye, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";


type UserActionsProps = {
  user: TUser;
  onAdd?: (user: TUser) => void; // Callback for add action
  onView?: (user: TUser) => void; // Callback for view action
  onDelete?: (user: TUser) => void; // Callback for delete action
};

export const UserActions = ({ user, onAdd, onView, onDelete }: UserActionsProps) => {
  return (
    <div className="flex space-x-6">
      {onAdd && <button
        onClick={() => onAdd(user)} // Trigger the onView callback if defined
        className="text-gray-500 hover:text-blue-700"
      >
        <FaPlus className="w-5 h-5" />
      </button>}
      {/* View Button */}
      {onView && <button
        onClick={() => onView(user)} // Trigger the onView callback if defined
        className="text-gray-500 hover:text-blue-700"
      >
        <FaEye className="w-5 h-5" />
      </button>}
      {/* Delete Button */}
      {onDelete && <button
        onClick={() => onDelete(user)} // Trigger the onDelete callback
        className="text-red-500 hover:text-red-700"
      >
        <FaTrash className="w-4 h-4" />
      </button>}
    </div>
  );
};