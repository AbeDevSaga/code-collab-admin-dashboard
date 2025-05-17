import React, { useState, useEffect } from "react";
import { TTask, TUser, TTaskStatus } from "../../constants/type";

interface AddTaskProps {
  closeAddTask: () => void;
  onAddTasks: (newTasks: TTask[]) => void; // Modified to handle multiple tasks
  projectId: string;
  projectUsers: TUser[]; // Users already assigned to the project
}

const AddTask: React.FC<AddTaskProps> = ({
  closeAddTask,
  onAddTasks,
  projectId,
  projectUsers,
}) => {
  const [tasks, setTasks] = useState<TTask[]>([
    {
      _id: "",
      project: projectId,
      name: "",
      description: "",
      assignedTo: [],
      status: "pending",
      startDate: new Date(),
      dueDate: new Date(),
      percentage: "0",
    },
  ]);

  const [equalPercentage, setEqualPercentage] = useState(true);

  const handleTaskChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[index] = {
        ...updatedTasks[index],
        [name]: name === "status" ? (value as TTask["status"]) : value,
      };
      return updatedTasks;
    });
  };

  const handleDateChange = (
    index: number,
    field: "startDate" | "dueDate",
    value: string
  ) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[index] = {
        ...updatedTasks[index],
        [field]: new Date(value),
      };
      return updatedTasks;
    });
  };

  const handleUserSelection = (
    taskIndex: number,
    userId: string | undefined,
    isChecked: boolean
  ) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const currentAssigned = [...updatedTasks[taskIndex].assignedTo];

      if (isChecked) {
        const userToAdd = projectUsers.find((user) => user._id === userId);
        if (userToAdd) {
          currentAssigned.push(userToAdd);
        }
      } else {
        const userIndex = currentAssigned.findIndex(
          (user) => user._id === userId
        );
        if (userIndex > -1) {
          currentAssigned.splice(userIndex, 1);
        }
      }

      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        assignedTo: currentAssigned,
      };

      return updatedTasks;
    });
  };

  const addNewTask = () => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        _id: "",
        project: projectId,
        name: "",
        description: "",
        assignedTo: [],
        status: "pending",
        startDate: new Date(),
        dueDate: new Date(),
        percentage: "0",
      },
    ]);
  };

  const removeTask = (index: number) => {
    if (tasks.length <= 1) return;
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const calculateEqualPercentage = () => {
    const percentage = (100 / tasks.length).toFixed(2);
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        percentage,
      }))
    );
  };

  useEffect(() => {
    if (equalPercentage) {
      calculateEqualPercentage();
    }
  }, [tasks.length, equalPercentage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all tasks have required fields
    const isValid = tasks.every(
      (task) => task.name.trim() && task.assignedTo.length > 0
    );

    if (!isValid) {
      alert(
        "Please fill all required fields for each task (Task Name and at least one assigned user)"
      );
      return;
    }

    console.log("Tasks to be added:", tasks);
    onAddTasks(tasks);
  };

  return (
    <div className="px-2 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Add New Tasks for Project
        </h2>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="equalPercentage"
            checked={equalPercentage}
            onChange={(e) => setEqualPercentage(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="equalPercentage">
            Distribute percentage equally among tasks
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {tasks.map((task, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Task #{index + 1}</h3>
                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Task
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Task Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={task.name}
                      onChange={(e) => handleTaskChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={task.description}
                      onChange={(e) => handleTaskChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={task.status}
                      onChange={(e) => handleTaskChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={task.startDate?.toISOString().split("T")[0]}
                      onChange={(e) =>
                        handleDateChange(index, "startDate", e.target.value)
                      }
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={task.dueDate?.toISOString().split("T")[0]}
                      onChange={(e) =>
                        handleDateChange(index, "dueDate", e.target.value)
                      }
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {!equalPercentage && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Percentage *
                      </label>
                      <input
                        type="number"
                        name="percentage"
                        value={task.percentage}
                        onChange={(e) => handleTaskChange(index, e)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        min="0"
                        max="100"
                        step="0.01"
                        required
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Assigned To *
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                      {projectUsers.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No users available for this project
                        </p>
                      ) : (
                        projectUsers.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="checkbox"
                              id={`user-${index}-${user._id}`}
                              checked={task.assignedTo.some(
                                (assignedUser) => assignedUser._id === user._id
                              )}
                              onChange={(e) =>
                                handleUserSelection(
                                  index,
                                  user._id,
                                  e.target.checked
                                )
                              }
                              className="mr-2"
                            />
                            <label
                              htmlFor={`user-${index}-${user._id || "unknown"}`}
                            >
                              {user.username}
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap justify-between">
            <button
              type="button"
              onClick={addNewTask}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mb-4"
            >
              Add Another Task
            </button>

            <div>
              <button
                type="button"
                onClick={closeAddTask}
                className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                disabled={tasks.some(
                  (t) => !t.name.trim() || t.assignedTo.length === 0
                )}
              >
                Add Tasks
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
