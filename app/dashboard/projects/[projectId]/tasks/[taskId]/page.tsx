"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TTask, TUser, TProject, TFile } from "@/app/constants/type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  fetchTaskById,
  updateTask,
  deleteTask,
} from "@/app/redux/slices/taskSlice";
import SectionHeader from "@/app/components/SectionHeader";
import ActionButton from "@/app/components/ActionButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import DeleteTask from "@/app/components/task_related/DeleteTask";
import UserTable from "@/app/components/user_related/UsersTable";
import { formatDate, daysUntilDue } from "@/app/utils/dateUtils";

const TaskDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { taskId } = useParams() as { taskId: string };
  const { user } = useSelector((state: RootState) => state.auth);
  const [task, setTask] = useState<TTask | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<TUser[]>([]);
  const [files, setFiles] = useState<TFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [showActions, setShowActions] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TTask | null>(null);

  // Open the modals
  const openUpdateModal = (task: TTask) => {
    setIsUpdateModalOpen(true);
    setSelectedTask(task);
  };
  const openDeleteModal = (task: TTask) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  // Handle modal actions
  const handleUpdateTask = async (updatedTask: TTask) => {
    if (selectedTask) {
      const resultAction = await dispatch(
        updateTask({
          id: selectedTask._id || "",
          taskData: updatedTask,
        })
      );
      if (updateTask.fulfilled.match(resultAction)) {
        console.log("Task updated successfully:", resultAction.payload);
        setTask(resultAction.payload);
        setIsUpdateModalOpen(false);
      } else {
        console.error("Failed to update task:", resultAction.payload);
      }
    }
  };

  const handleDeleteTask = async (selectedTask: TTask) => {
    if (selectedTask) {
      const resultAction = await dispatch(
        deleteTask(selectedTask._id || "")
      );
      if (deleteTask.fulfilled.match(resultAction)) {
        console.log("Task deleted successfully:", resultAction.payload);
        setIsDeleteModalOpen(false);
        router.push("/tasks"); // Redirect to tasks page after deletion
      } else {
        console.error("Failed to delete task:", resultAction.payload);
      }
    }
  };

  // Close the modals
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Fetch task data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (taskId) {
        try {
          setLoading(true);
          setError(null);

          const taskResponse = await dispatch(fetchTaskById(taskId));
          if (fetchTaskById.fulfilled.match(taskResponse)) {
            setTask(taskResponse.payload);
            console.log("taskResponse.payload: ", taskResponse.payload)
            setAssignedUsers(taskResponse.payload.assignedTo || []);
            // Fetch related files if needed
          } else if (fetchTaskById.rejected.match(taskResponse)) {
            setError("Failed to fetch task data");
          }
        } catch (err) {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dispatch, taskId]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle case where task data is not available
  if (!task) {
    return <div>Task not found</div>;
  }

  // Calculate due date alert
  const dueDateAlert = task.dueDate ? daysUntilDue(task.dueDate) : null;
  const isOverdue = dueDateAlert && dueDateAlert < 0;
  const isDueSoon = dueDateAlert && dueDateAlert <= 3 && dueDateAlert >= 0;

  return (
    <div className="w-full h-full relative space-y-4 mx-auto overflow-auto scrollbar-hide">
      {/* Task Details Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="absolute top-2 right-2">
          <BsThreeDotsVertical
            onClick={() => setShowActions(!showActions)}
            className="text-gray-600 cursor-pointer"
          />
        </div>
        {/* Actions */}
        {showActions && (
          <div className="absolute bg-white py-2 top-10 right-2 rounded-lg shadow-md">
            <div
              onClick={() => openUpdateModal(task)}
              className="right-2 bg-white px-4 pb-2 cursor-pointer hover:text-primary duration-300"
            >
              Update Task
            </div>
            <div
              onClick={() => openDeleteModal(task)}
              className="right-2 bg-white px-4 cursor-pointer border-t border-gray-200 pt-2 hover:text-red-500 duration-300"
            >
              Delete Task
            </div>
          </div>
        )}
        
        {/* Task Name and Status */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{task.name}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            task.status === "completed" ? "bg-green-100 text-green-800" :
            task.status === "in-progress" ? "bg-blue-100 text-blue-800" :
            task.status === "blocked" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {task.status}
          </span>
        </div>

        {/* Due Date Alert */}
        {dueDateAlert !== null && (
          <div className={`mb-4 p-3 rounded-lg ${
            isOverdue ? "bg-red-100 text-red-800" :
            isDueSoon ? "bg-yellow-100 text-yellow-800" :
            "bg-green-100 text-green-800"
          }`}>
            {isOverdue ? (
              <p>⚠️ Overdue by {Math.abs(dueDateAlert)} days</p>
            ) : isDueSoon ? (
              <p>⚠️ Due in {dueDateAlert} days</p>
            ) : (
              <p>✓ Due in {dueDateAlert} days</p>
            )}
          </div>
        )}

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Description */}
          <div className="md:col-span-2 lg:col-span-3 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Description</h2>
            <p className="text-gray-800 mt-1">{task.description || "No description provided"}</p>
          </div>

          {/* Created By */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Created By</h2>
            <p className="text-gray-800">{task.createdBy?.username || "Unknown"}</p>
          </div>

          {/* Project */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Project</h2>
            <p className="text-gray-800">{task.project?.name || "No project"}</p>
          </div>

          {/* Priority */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Priority</h2>
            <p className={`font-medium ${
              task.priority === "high" ? "text-red-600" :
              task.priority === "medium" ? "text-yellow-600" :
              "text-green-600"
            }`}>
              {task.priority || "Not specified"}
            </p>
          </div>

          {/* Start Date */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Start Date</h2>
            <p className="text-gray-800">
              {task.startDate ? formatDate(task.startDate) : "Not specified"}
            </p>
          </div>

          {/* Due Date */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Due Date</h2>
            <p className="text-gray-800">
              {task.dueDate ? formatDate(task.dueDate) : "Not specified"}
            </p>
          </div>

          {/* Completion */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Completion</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${task.percentage || 0}%` }}
              ></div>
            </div>
            <p className="text-gray-800 mt-1">{task.percentage || 0}% complete</p>
          </div>
        </div>
      </div>

      {/* Assigned Users Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="users" />
        </div>
        {assignedUsers.length > 0 ? (
          <UserTable 
            users={assignedUsers} 
            role="assigned"
            px="2"
            py="2"
            onViewUser={()=>console.log("users")}
          />
        ) : (
          <p className="text-gray-500">No users assigned to this task.</p>
        )}
      </div>

      {/* Files Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="files" />
          <div className="w-auto">
            <ActionButton
              label="Add File"
              onClick={() => {}}
              icon="file"
            />
          </div>
        </div>
        {files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file) => (
              <div key={file._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  {file.name}
                </h3>
                <p className="text-gray-600">{file.description || "No description"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No files attached to this task.</p>
        )}
      </div>

      {/* Comments Section (would need implementation) */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="users" />
        </div>
        <p className="text-gray-500">Comments feature would go here.</p>
      </div>

      {/* Activity Log Section (would need implementation) */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="users" />
        </div>
        <p className="text-gray-500">Activity log would go here.</p>
      </div>

      {/* Modals */}
      {/* {isUpdateModalOpen && selectedTask && (
        <UpdateTask
          closeUpdateTask={closeUpdateModal}
          onUpdateTask={handleUpdateTask}
          taskToUpdate={selectedTask}
        />
      )} */}
      {isDeleteModalOpen && selectedTask && (
        <DeleteTask
          task={selectedTask}
          closeDeleteTask={closeDeleteModal}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default TaskDetailsPage;