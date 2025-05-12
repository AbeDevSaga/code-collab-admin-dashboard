import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { TFile } from "@/app/constants/type"; // Define TFile type for your file structure

const API_URL = process.env.NEXT_PUBLIC_FILE_API;

interface FileState {
  files: TFile[];
  currentFile: TFile | null;
  fileStructure: any[]; // Adjust type according to your file structure
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchAllFiles = createAsyncThunk(
  "files/fetchAllFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TFile[]>(`${API_URL}/list`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      console.log("file reponse: ", response.data)
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

export const fetchFileById = createAsyncThunk(
  "files/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TFile>(`${API_URL}/content/${id}`, {
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

export const createNewFile = createAsyncThunk(
  "files/create",
  async (fileData: Omit<TFile, "_id">, { rejectWithValue }) => {
    try {
      const response = await axios.post<TFile>(`${API_URL}/create`, fileData, {
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

export const updateFile = createAsyncThunk(
  "files/update",
  async (
    { id, fileData }: { id: string; fileData: Partial<TFile> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TFile>(
        `${API_URL}/update/${id}`,
        fileData,
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

export const saveFileContent = createAsyncThunk(
  "files/save",
  async (
    { id, content }: { id: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TFile>(
        `${API_URL}/save/${id}`,
        { content },
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

export const deleteFileById = createAsyncThunk(
  "files/delete",
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

export const fetchFileStructure = createAsyncThunk(
  "files/structure",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<any[]>(`${API_URL}/structure`, {
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

// Slice
const initialState: FileState = {
  files: [],
  currentFile: null,
  fileStructure: [],
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setCurrentFile: (state, action: PayloadAction<TFile | null>) => {
      state.currentFile = action.payload;
    },
    clearFiles: (state) => {
      state.files = [];
      state.currentFile = null;
      state.fileStructure = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all files
      .addCase(fetchAllFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllFiles.fulfilled,
        (state, action: PayloadAction<TFile[]>) => {
          state.loading = false;
          state.files = action.payload;
        }
      )
      .addCase(fetchAllFiles.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch file by ID
      .addCase(fetchFileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFileById.fulfilled,
        (state, action: PayloadAction<TFile>) => {
          state.loading = false;
          state.currentFile = action.payload;
        }
      )
      .addCase(fetchFileById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create file
      .addCase(createNewFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createNewFile.fulfilled,
        (state, action: PayloadAction<TFile>) => {
          state.loading = false;
          state.files.push(action.payload);
        }
      )
      .addCase(createNewFile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update file
      .addCase(updateFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateFile.fulfilled,
        (state, action: PayloadAction<TFile>) => {
          state.loading = false;
          const index = state.files.findIndex(
            (file) => file._id === action.payload._id
          );
          if (index !== -1) {
            state.files[index] = action.payload;
          }
          if (state.currentFile?._id === action.payload._id) {
            state.currentFile = action.payload;
          }
        }
      )
      .addCase(updateFile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save file content
      .addCase(saveFileContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        saveFileContent.fulfilled,
        (state, action: PayloadAction<TFile>) => {
          state.loading = false;
          const index = state.files.findIndex(
            (file) => file._id === action.payload._id
          );
          if (index !== -1) {
            state.files[index] = action.payload;
          }
          if (state.currentFile?._id === action.payload._id) {
            state.currentFile = action.payload;
          }
        }
      )
      .addCase(saveFileContent.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete file
      .addCase(deleteFileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteFileById.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.files = state.files.filter(
            (file) => file._id !== action.payload
          );
          if (state.currentFile?._id === action.payload) {
            state.currentFile = null;
          }
        }
      )
      .addCase(deleteFileById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch file structure
      .addCase(fetchFileStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFileStructure.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.fileStructure = action.payload;
        }
      )
      .addCase(fetchFileStructure.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentFile, clearFiles } = fileSlice.actions;
export default fileSlice.reducer;