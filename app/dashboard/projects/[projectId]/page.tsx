"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TProject, TUser, TTask, TFile } from "@/app/constants/type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import {
  deleteProject,
  fetchProjectById,
  updateProject,
} from "@/app/redux/slices/projectSlice";
import SectionHeader from "@/app/components/SectionHeader";
import ActionButton from "@/app/components/ActionButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";

const ProjectDetailPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<TProject | null>(null);
  const [tasksList, setTasksList] = useState<TTask[]>([]);
  const [filesList, setFilesList] = useState<TFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showActions, setShowActions] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TProject | null>(null);

  // Open the modals
  const openAddUserModal = () => {
    setAddUserModalOpen(true);
  };
  const openAddTaskModal = () => {
    setAddTaskModalOpen(true);
  };
  const openAddFileModal = () => {
    setAddFileModalOpen(true);
  };
  const openUpdateModal = (project: TProject) => {
    setIsUpdateModalOpen(true);
    setSelectedProject(project);
  };
  const openDeleteModal = (project: TProject) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  // Handle modal actions
  const handleAddUser = (newUser: TUser) => {
    console.log("New Task Data:", newUser);
    // Add task logic here
    setAddUserModalOpen(false);
  };
  const handleAddTask = (newTask: TTask) => {
    console.log("New Task Data:", newTask);
    // Add task logic here
    setAddTaskModalOpen(false);
  };

  const handleAddFile = (newFile: TFile) => {
    console.log("New File Data:", newFile);
    // Add file logic here
    setAddFileModalOpen(false);
  };

  const handleUpdateProject = async (updatedProject: TProject) => {
    console.log("Updated Project: ", updatedProject);
    if (selectedProject) {
      const resultAction = await dispatch(
        updateProject({
          id: selectedProject._id || "",
          projectData: updatedProject,
        })
      );
      if (updateProject.fulfilled.match(resultAction)) {
        console.log("Project updated successfully:", resultAction.payload);
        setIsUpdateModalOpen(false);
      } else {
        console.error("Failed to update Project:", resultAction.payload);
      }
    }
  };

  const handleDeleteProject = async () => {
    console.log("Deleting Project:", selectedProject);
    const resultAction = await dispatch(
      deleteProject(selectedProject?._id || "")
    );
    if (deleteProject.fulfilled.match(resultAction)) {
      console.log("Project deleted successfully:", resultAction.payload);
      setIsDeleteModalOpen(false);
      router.push("/projects"); // Redirect to projects page after deletion
    } else {
      console.error("Failed to delete Project:", resultAction.payload);
    }
  };

  const handleViewTask = (task: TTask) => {
    router.push(`${projectId}/tasks/${task._id}`);
  };

  const handleViewFile = (file: TFile) => {
    router.push(`${projectId}/files/${file._id}`);
  };

  // Close the modals
  const closeAddUserModal = () => {
    setAddUserModalOpen(false);
  };
  const closeAddTaskModal = () => {
    setAddTaskModalOpen(false);
  };
  const closeAddFileModal = () => {
    setAddFileModalOpen(false);
  };
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Fetch project data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (projectId) {
        try {
          setLoading(true);
          setError(null);

          // Fetch project details
          const projectResponse = await dispatch(fetchProjectById(projectId));
          if (fetchProjectById.fulfilled.match(projectResponse)) {
            setProject(projectResponse.payload);
          } else if (fetchProjectById.rejected.match(projectResponse)) {
            setError("Failed to fetch project data");
          }

          // Fetch tasks for the project
        //   const tasksResponse = await dispatch(fetchTasksByProjectId(projectId));
        //   if (fetchTasksByProjectId.fulfilled.match(tasksResponse)) {
        //     setTasksList(tasksResponse.payload);
        //   } else {
        //     setError("Failed to fetch tasks");
        //   }

          // Fetch files for the project
        //   const filesResponse = await dispatch(fetchFilesByProjectId(projectId));
        //   if (fetchFilesByProjectId.fulfilled.match(filesResponse)) {
        //     setFilesList(filesResponse.payload);
        //   } else {
        //     setError("Failed to fetch files");
        //   }
        } catch (err) {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dispatch, projectId]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle case where project data is not available
  if (!project) {
    return <div>Project not found</div>;
  }

  console.log("project: ", project);

  return (
    <div className="w-full h-full relative space-y-4 mx-auto overflow-auto scrollbar-hide">
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
              onClick={() =>
                openUpdateModal({
                  ...project,
                  _id: project._id || "",
                })
              }
              className="right-2 bg-white px-4 pb-2 cursor-pointer hover:text-primary duration-300"
            >
              Update Project
            </div>
            <div
              onClick={() =>
                openDeleteModal({
                  ...project,
                  _id: project._id || "",
                })
              }
              className="right-2 bg-white px-4 cursor-pointer border-t border-gray-200 pt-2 hover:text-red-500 duration-300"
            >
              Delete Project
            </div>
          </div>
        )}
        {/* Project Name and Description */}
        <div className="flex items-center space-x-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
        </div>
        {project.description && (
          <p className="text-gray-600 mb-6">{project.description}</p>
        )}

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Status</h2>
            <p className="text-gray-800">{project.status}</p>
          </div>

          {/* Created By */}
          {project.createdBy && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Created By</h2>
              <p className="text-gray-800">{project.createdBy.username}</p>
            </div>
          )}

          {/* Organization */}
          {project.organization && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">
                Organization
              </h2>
              <p className="text-gray-800">{project.organization.name}</p>
            </div>
          )}

          {/* Start Date */}
          {project.startDate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">
                Start Date
              </h2>
              <p className="text-gray-800">
                {new Date(project.startDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* End Date */}
          {project.endDate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">End Date</h2>
              <p className="text-gray-800">
                {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="users" />
          <div className="w-auto">
            <ActionButton
              label="Add User"
              onClick={openAddTaskModal}
              icon="task"
            />
          </div>
        </div>
        {/* {tasksList && tasksList.length > 0 && (
          <TaskTable
            onViewTask={handleViewTask}
            tasks={tasksList}
            px="2"
            py="2"
          />
        )} */}
      </div>

      {/* Tasks Section */}
      <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="tasks" />
          <div className="w-auto">
            <ActionButton
              label="Add Task"
              onClick={openAddTaskModal}
              icon="task"
            />
          </div>
        </div>
        {/* {tasksList && tasksList.length > 0 && (
          <TaskTable
            onViewTask={handleViewTask}
            tasks={tasksList}
            px="2"
            py="2"
          />
        )} */}
      </div>

      {/* Files Section */}
      <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="files" />
          <div className="w-auto">
            <ActionButton
              label="Add File"
              onClick={openAddFileModal}
              icon="file"
            />
          </div>
        </div>
        {/* {filesList && filesList.length > 0 && (
          <FileTable
            onViewFile={handleViewFile}
            files={filesList}
            px="2"
            py="2"
          />
        )} */}
      </div>

      {/* Modals
      {addTaskModalOpen && (
        <AddTask
          closeAddTask={closeAddTaskModal}
          onAddTask={handleAddTask}
          projectId={projectId}
        />
      )}
      {addFileModalOpen && (
        <AddFile
          closeAddFile={closeAddFileModal}
          onAddFile={handleAddFile}
          projectId={projectId}
        />
      )}
      {isUpdateModalOpen && selectedProject && (
        <UpdateProject
          closeUpdateProject={closeUpdateModal}
          onUpdateProject={handleUpdateProject}
          projectToUpdate={selectedProject}
        />
      )}
      {isDeleteModalOpen && selectedProject && (
        <DeleteProject
          project={selectedProject}
          closeDeleteProject={closeDeleteModal}
          onDeleteProject={handleDeleteProject}
        />
      )} */}
    </div>
  );
};

export default ProjectDetailPage;