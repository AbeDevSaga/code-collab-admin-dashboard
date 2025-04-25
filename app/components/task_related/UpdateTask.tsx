// app/components/task_related/UpdateTask.tsx
"use client";
import React, { useState } from "react";
import { TTask, TUser } from "@/app/constants/type";

interface UpdateTaskProps {
  taskToUpdate: TTask;
  projectUsers: TUser[];
  closeUpdateTask: () => void;
  onUpdateTask: (updatedTask: TTask) => void;
}

const UpdateTask: React.FC<UpdateTaskProps> = ({
  taskToUpdate,
  projectUsers,
  closeUpdateTask,
  onUpdateTask,
}) => {
  const [taskData, setTaskData] = useState<TTask>(taskToUpdate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTask(taskData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Task</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields for task properties */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={closeUpdateTask}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;