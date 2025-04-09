import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { TUser } from "@/app/constants/type";

const API_URL = process.env.NEXT_PUBLIC_USERS_API;

interface UserState {
  users: TUser[];
  currentUser: TUser | null;
  premiumUsers: TUser[];
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    // localStorage.removeItem("token");
    // window.location.href = "/auth/login";
  }
  return error.response?.data || "An unexpected error occurred";
};

// Async Thunks
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TUser[]>(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      console.log("response: ", response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TUser>(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchUsersByOrganizationId = createAsyncThunk(
  "users/fetchByOrganizationId",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TUser[]>(`${API_URL}/org/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchPremiumUsers = createAsyncThunk(
  "users/fetchPremium",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TUser[]>(`${API_URL}/premium`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (userData: Omit<TUser, "_id">, { rejectWithValue }) => {
    try {
      const response = await axios.post<TUser>(
        `${API_URL}/create_user`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (
    { id, userData }: { id: string; userData: Partial<TUser> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TUser>(
        `${API_URL}/update_user/${id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("update response: ", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Slice
const initialState: UserState = {
  users: [],
  currentUser: null,
  premiumUsers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state, action: PayloadAction<TUser[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(fetchAllUsers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.loading = false;
          state.currentUser = action.payload;
        }
      )
      .addCase(fetchUserById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Users by Organization ID
      .addCase(fetchUsersByOrganizationId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsersByOrganizationId.fulfilled,
        (state, action: PayloadAction<TUser[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(
        fetchUsersByOrganizationId.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Fetch Premium Users
      .addCase(fetchPremiumUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPremiumUsers.fulfilled,
        (state, action: PayloadAction<TUser[]>) => {
          state.loading = false;
          state.premiumUsers = action.payload;
        }
      )
      .addCase(
        fetchPremiumUsers.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Create User
      .addCase(createUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.users.push(action.payload);
      })

      // Update User
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  },
});

export default userSlice.reducer;
