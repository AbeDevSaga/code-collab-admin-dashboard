import { TTask } from "@/app/constants/type";
import React from "react";

interface DeleteTaskProps {
  task: TTask;
  closeDeleteTask: () => void;
  onDeleteConfirm?: (taskId: string) => void;
}

const DeleteTask: React.FC<DeleteTaskProps> = ({ 
  task, 
  closeDeleteTask,
  onDeleteConfirm 
}) => {
  const handleDelete = () => {
    if (onDeleteConfirm) {
      onDeleteConfirm(task._id);
    }
    closeDeleteTask();
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculate progress based on status
  const getProgressInfo = () => {
    switch(task.status) {
      case "completed":
        return { percentage: "100%", color: "bg-green-600" };
      case "in-progress":
        return { 
          percentage: task.percentage || "50%", 
          color: "bg-blue-600" 
        };
      default: // not-started
        return { percentage: "0%", color: "bg-gray-400" };
    }
  };

  const progress = getProgressInfo();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="relative bg-white rounded-lg shadow-lg py-6 w-full max-w-md">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeDeleteTask}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Task Details */}
        <div className="flex flex-col items-center space-y-4 px-4">
          {/* Task Icon */}
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>

          {/* Task Name */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {task.taskName}
          </h2>

          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              task.status === "completed" 
                ? "bg-green-100 text-green-800" 
                : task.status === "in-progress" 
                ? "bg-yellow-100 text-yellow-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {task.status || "not-started"}
            </span>
          </div>

          {/* Task Details */}
          <div className="w-full space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Start Date:</span>
              <span>{formatDate(task.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">End Date:</span>
              <span>{formatDate(task.endDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Progress:</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${progress.color}`} 
                    style={{ width: progress.percentage }}
                  ></div>
                </div>
                <span>{progress.percentage}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <p className="text-center text-gray-600 py-2">
            Are you sure you want to delete this task?
          </p>

          {/* Action Buttons */}
          <div className="flex w-full space-x-4 pt-2">
            <button
              onClick={closeDeleteTask}
              className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTask;