import { TChatGroup } from "@/app/constants/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_CHAT_GROUP_API;

interface ChatGroupState {
  chats: TChatGroup[];
  currentChat: TChatGroup | null;
  organizationChats: TChatGroup[];
  projectChats: TChatGroup[];
  userChats: TChatGroup[];
  loading: boolean;
  error: string | null;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async Thunks
export const fetchAllChats = createAsyncThunk(
  "chats/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<TChatGroup[]>(`${API_URL}`, {
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

export const fetchOrganizationChats = createAsyncThunk(
  "chats/fetchByOrganization",
  async (organizationId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TChatGroup[]>(
        `${API_URL}/organization/${organizationId}`,
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

export const fetchProjectChats = createAsyncThunk(
  "chats/fetchByProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TChatGroup[]>(
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

export const fetchUserChats = createAsyncThunk(
  "chats/fetchUserChats",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TChatGroup[]>(
        `${API_URL}/${userId}`,
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

export const fetchChatById = createAsyncThunk(
  "chats/fetchById",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<TChatGroup>(
        `${API_URL}/chat/${chatId}`,
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

export const createChat = createAsyncThunk(
  "chats/create",
  async (chatData: Omit<TChatGroup, "_id">, { rejectWithValue }) => {
    try {
      const response = await axios.post<TChatGroup>(
        `${API_URL}/create`,
        chatData,
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

export const updateChat = createAsyncThunk(
  "chats/update",
  async (
    { id, chatData }: { id: string; chatData: Partial<TChatGroup> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TChatGroup>(
        `${API_URL}/update/${id}`,
        chatData,
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

export const deleteChat = createAsyncThunk(
  "chats/delete",
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

export const generateInvitationLink = createAsyncThunk(
  "chats/generateInviteLink",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ invitationLink: string; expiresAt: Date }>(
        `${API_URL}/generate-link/${chatId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return { chatId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const joinChatViaLink = createAsyncThunk(
  "chats/joinViaLink",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<TChatGroup>(
        `${API_URL}/join-via-link`,
        { token },
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

export const removeParticipant = createAsyncThunk(
  "chats/removeParticipant",
  async (
    { chatId, participantId }: { chatId: string; participantId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<TChatGroup>(
        `${API_URL}/remove-participant/${chatId}`,
        { participantId },
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

// Slice
const initialState: ChatGroupState = {
  chats: [],
  currentChat: null,
  organizationChats: [],
  projectChats: [],
  userChats: [],
  loading: false,
  error: null,
};

const chatGroupSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Chats
      .addCase(fetchAllChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllChats.fulfilled,
        (state, action: PayloadAction<TChatGroup[]>) => {
          state.loading = false;
          state.chats = action.payload;
        }
      )
      .addCase(fetchAllChats.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Organization Chats
      .addCase(fetchOrganizationChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrganizationChats.fulfilled,
        (state, action: PayloadAction<TChatGroup[]>) => {
          state.loading = false;
          state.organizationChats = action.payload;
        }
      )
      .addCase(fetchOrganizationChats.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Project Chats
      .addCase(fetchProjectChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectChats.fulfilled,
        (state, action: PayloadAction<TChatGroup[]>) => {
          state.loading = false;
          state.projectChats = action.payload;
        }
      )
      .addCase(fetchProjectChats.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch User Chats
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserChats.fulfilled,
        (state, action: PayloadAction<TChatGroup[]>) => {
          state.loading = false;
          state.userChats = action.payload;
        }
      )
      .addCase(fetchUserChats.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Chat By ID
      .addCase(fetchChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChatById.fulfilled,
        (state, action: PayloadAction<TChatGroup>) => {
          state.loading = false;
          state.currentChat = action.payload;
        }
      )
      .addCase(fetchChatById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Chat
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createChat.fulfilled,
        (state, action: PayloadAction<TChatGroup>) => {
          state.loading = false;
          state.chats.push(action.payload);
          state.userChats.push(action.payload);
        }
      )
      .addCase(createChat.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Chat
      .addCase(updateChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateChat.fulfilled,
        (state, action: PayloadAction<TChatGroup>) => {
          state.loading = false;
          state.currentChat = action.payload;
          state.chats = state.chats.map(chat => 
            chat._id === action.payload._id ? action.payload : chat
          );
          state.userChats = state.userChats.map(chat => 
            chat._id === action.payload._id ? action.payload : chat
          );
          state.projectChats = state.projectChats.map(chat => 
            chat._id === action.payload._id ? action.payload : chat
          );
          state.organizationChats = state.organizationChats.map(chat => 
            chat._id === action.payload._id ? action.payload : chat
          );
        }
      )
      .addCase(updateChat.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Chat
      .addCase(deleteChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteChat.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.chats = state.chats.filter(chat => chat._id !== action.payload);
          state.userChats = state.userChats.filter(chat => chat._id !== action.payload);
          state.projectChats = state.projectChats.filter(chat => chat._id !== action.payload);
          state.organizationChats = state.organizationChats.filter(chat => chat._id !== action.payload);
          if (state.currentChat?._id === action.payload) {
            state.currentChat = null;
          }
        }
      )
      .addCase(deleteChat.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Generate Invitation Link
      .addCase(generateInvitationLink.fulfilled, (state, action) => {
        const { chatId, invitationLink, expiresAt } = action.payload;
        const chatToUpdate = state.chats.find(chat => chat._id === chatId);
        if (chatToUpdate) {
          chatToUpdate.invitationLink = invitationLink;
          chatToUpdate.invitationLinkExpires = expiresAt;
        }
        if (state.currentChat?._id === chatId) {
          state.currentChat.invitationLink = invitationLink;
          state.currentChat.invitationLinkExpires = expiresAt;
        }
      })
      
      // Join Chat Via Link
      .addCase(joinChatViaLink.fulfilled, (state, action: PayloadAction<TChatGroup>) => {
        state.userChats.push(action.payload);
      })
      
      // Remove Participant
      .addCase(removeParticipant.fulfilled, (state, action: PayloadAction<TChatGroup>) => {
        const updatedChat = action.payload;
        state.chats = state.chats.map(chat => 
          chat._id === updatedChat._id ? updatedChat : chat
        );
        if (state.currentChat?._id === updatedChat._id) {
          state.currentChat = updatedChat;
        }
      });
  },
});

export default chatGroupSlice.reducer;