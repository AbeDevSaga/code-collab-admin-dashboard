import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { TTask } from "@/app/constants/type"; // Define TTask type for your tasks

const API_URL = process.env.NEXT_PUBLIC_TASK_API;

interface TaskState {
  tasks: TTask[];
  currentTask: TTask | null;
  projectTasks: TTask[]; // Tasks for a specific project
  assignedTasks: TTask[]; // Tasks assigned to a user
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchAllTasks = createAsyncThunk(
  "tasks/fetchAllTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TTask[]>(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TTask>(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTasksByProjectId = createAsyncThunk(
  "tasks/fetchByProjectId",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TTask[]>(
        `${API_URL}/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTasksByStatus = createAsyncThunk(
  "tasks/fetchByStatus",
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TTask[]>(`${API_URL}/status/${status}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTasksByAssignedUser = createAsyncThunk(
  "tasks/fetchByAssignedUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TTask[]>(
        `${API_URL}/assigned/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTasks = createAsyncThunk(
  "tasks/create",
  async (
    tasksData: Omit<TTask, "_id"> | Omit<TTask, "_id">[],
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<TTask | TTask[]>(
        `${API_URL}/create`,
        tasksData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (
    { id, taskData }: { id: string; taskData: Partial<TTask> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TTask>(
        `${API_URL}/update/${id}`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  projectTasks: [],
  assignedTasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearProjectTasks: (state) => {
      state.projectTasks = [];
    },
    clearAssignedTasks: (state) => {
      state.assignedTasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Specific fulfilled cases
      .addCase(
        fetchAllTasks.fulfilled,
        (state, action: PayloadAction<TTask[]>) => {
          state.loading = false;
          state.tasks = action.payload;
        }
      )
      .addCase(
        fetchTaskById.fulfilled,
        (state, action: PayloadAction<TTask>) => {
          state.loading = false;
          state.currentTask = action.payload;
        }
      )
      .addCase(
        fetchTasksByProjectId.fulfilled,
        (state, action: PayloadAction<TTask[]>) => {
          state.loading = false;
          state.projectTasks = action.payload;
        }
      )
      .addCase(
        fetchTasksByStatus.fulfilled,
        (state, action: PayloadAction<TTask[]>) => {
          state.loading = false;
          state.tasks = action.payload;
        }
      )
      .addCase(
        fetchTasksByAssignedUser.fulfilled,
        (state, action: PayloadAction<TTask[]>) => {
          state.loading = false;
          state.assignedTasks = action.payload;
        }
      )
      .addCase(
        createTasks.fulfilled,
        (state, action: PayloadAction<TTask | TTask[]>) => {
          const newTasks = Array.isArray(action.payload)
            ? action.payload
            : [action.payload];
          state.tasks = [...state.tasks, ...newTasks];

          // If these tasks belong to the current project, update projectTasks too
          if (state.projectTasks.length > 0 && newTasks[0].project) {
            const sameProject =
              state.projectTasks[0].project === newTasks[0].project;
            if (sameProject) {
              state.projectTasks = [...state.projectTasks, ...newTasks];
            }
          }
        }
      )
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<TTask>) => {
        // Update in tasks array
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );

        // Update in projectTasks if present
        state.projectTasks = state.projectTasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );

        // Update in assignedTasks if present
        state.assignedTasks = state.assignedTasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );

        // Update currentTask if it's the one being updated
        if (state.currentTask?._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        state.projectTasks = state.projectTasks.filter(
          (task) => task._id !== action.payload
        );
        state.assignedTasks = state.assignedTasks.filter(
          (task) => task._id !== action.payload
        );

        if (state.currentTask?._id === action.payload) {
          state.currentTask = null;
        }
      });
  },
});

export const { clearCurrentTask, clearProjectTasks, clearAssignedTasks } =
  taskSlice.actions;
export default taskSlice.reducer;