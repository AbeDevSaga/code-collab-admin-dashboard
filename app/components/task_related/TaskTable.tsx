"use client";
import React, { useState } from "react";
import Pagination from "../Pagination";
import DeleteTask from "./DeleteTask";
import { TTask } from "@/app/constants/type";
import { TaskActions } from "./TaskAction";
import StatusBadge from "../user_related/StatusBadge";

interface TaskTableProps {
  onViewTask: (taskData: TTask) => void;
  tasks: TTask[];
  px: string;
  py: string;
}

const TaskTable: React.FC<TaskTableProps> = ({ onViewTask, tasks, px, py }) => {
  const [deletedTask, setDeletedTask] = useState<TTask | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  const handleView = (task: TTask) => {
    onViewTask(task);
  };

  const handleDelete = (task: TTask) => {
    setDeletedTask(task);
  };

  const closeDeleteTask = () => {
    setDeletedTask(null);
  };

  // Pagination calculations
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(tasks.length / tasksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      {deletedTask && (
        <DeleteTask task={deletedTask} closeDeleteTask={closeDeleteTask} />
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-sidebarcolor">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Task Name
              </th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Start Date
              </th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                End Date
              </th>
              <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Progress
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTasks.map((task) => (
              <tr key={task._id}>
                <td
                  className={`px-${px} py-${py} whitespace-nowrap text-sm font-medium`}
                >
                  {task.taskName}
                </td>
                <td
                  className={`hidden sm:table-cell px-${px} py-${py} whitespace-nowrap text-sm`}
                >
                  <StatusBadge status={task.status} />
                </td>
                <td
                  className={`hidden md:table-cell px-${px} py-${py} whitespace-nowrap text-sm`}
                >
                  {formatDate(task.startDate)}
                </td>
                <td
                  className={`hidden lg:table-cell px-${px} py-${py} whitespace-nowrap text-sm`}
                >
                  {formatDate(task.endDate)}
                </td>
                <td
                  className={`hidden xl:table-cell px-${px} py-${py} whitespace-nowrap text-sm`}
                >
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        task.status === "completed"
                          ? "bg-green-600"
                          : task.status === "in-progress"
                          ? "bg-blue-600"
                          : "bg-gray-400"
                      }`}
                      style={{
                        width:
                          task.status === "completed"
                            ? "100%"
                            : task.status === "in-progress"
                            ? task.percentage || "50%"
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {task.status === "completed"
                      ? "100%"
                      : task.status === "in-progress"
                      ? task.percentage || "50%"
                      : "0%"}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-center whitespace-nowrap text-sm">
                  <TaskActions
                    task={task}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(tasks.length / tasksPerPage)}
        onPageChange={paginate}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  );
};

export default TaskTable;
