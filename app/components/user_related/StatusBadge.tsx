import React from "react";
interface StatusBadgeProps {
  status: "active" | "inactive" | "banned" | "pending" | "completed" | "archived" | "blocked" | "in-progress";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`py-2 flex items-center justify-center text-xs font-semibold rounded-lg ${
        status === "active"
          ? "bg-green-100 text-green-800"
          : status === "inactive" || status === "blocked"
          ? "bg-red-100 text-red-800"
          : status === "banned" || status === "in-progress"
          ? "bg-gray-100 text-gray-800"
          : status === "completed"
          ? "bg-blue-100 text-blue-800"
          : status === "archived"
          ? "bg-purple-100 text-purple-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;