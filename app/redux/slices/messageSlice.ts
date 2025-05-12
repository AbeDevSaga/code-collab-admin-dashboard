import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { TMessage } from "@/app/constants/type";

const API_URL = process.env.NEXT_PUBLIC_MESSAGE_API;

interface MessageState {
  messages: Record<string, TMessage[]>; // Key: chatId, Value: messages array
  currentMessage: TMessage | null;
  loading: boolean;
  error: string | null;
  hasMore: Record<string, boolean>; // Track if more messages are available per chat
  searchResults: TMessage[];
}

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

// Async Thunks
export const sendMessage = createAsyncThunk(
  "messages/send",
  async (
    { message }: { message: TMessage },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<TMessage>(
        `${API_URL}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("message: ", response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send message");
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/fetch",
  async (
    { chatId }: { chatId: string },
    { rejectWithValue, getState }
  ) => {
    try {
      console.log("chatId: ", chatId);
      const state = getState() as RootState;
      const existingMessages = state.messages.messages[chatId] || [];

      const response = await axios.get<TMessage[]
      >(`${API_URL}/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      return {
        chatId,
        messages: response.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
    }
  }
);

export const updateMessage = createAsyncThunk(
  "messages/update",
  async (
    { messageId, content }: { messageId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TMessage>(
        `${API_URL}/${messageId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update message");
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "messages/delete",
  async (messageId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${messageId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return messageId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete message");
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (messageId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<TMessage>(
        `${API_URL}/${messageId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark message as read");
    }
  }
);

export const searchMessages = createAsyncThunk(
  "messages/search",
  async (
    { chatId, query }: { chatId: string; query: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get<TMessage[]>(
        `${API_URL}/chat/${chatId}/search`,
        {
          params: { query },
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to search messages");
    }
  }
);

const initialState: MessageState = {
  messages: {},
  currentMessage: null,
  loading: false,
  error: null,
  hasMore: {},
  searchResults: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setCurrentMessage: (state, action: PayloadAction<TMessage | null>) => {
      state.currentMessage = action.payload;
    },
    addLocalMessage: (state, action: PayloadAction<{ chatId: string; message: TMessage }>) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].unshift(message);
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    resetMessages: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<TMessage>) => {
        state.loading = false;
        const chatId = action.payload.chat as string;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        state.messages[chatId].push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<{
        chatId: string;
        messages: TMessage[];
      }>) => {
        state.loading = false;
        const { chatId, messages } = action.payload;
        state.messages[chatId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Message
      .addCase(updateMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMessage.fulfilled, (state, action: PayloadAction<TMessage>) => {
        state.loading = false;
        const updatedMessage = action.payload;
        const chatId = updatedMessage.chat as string;
        
        if (state.messages[chatId]) {
          state.messages[chatId] = state.messages[chatId].map(msg =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          );
        }

        if (state.currentMessage?._id === updatedMessage._id) {
          state.currentMessage = updatedMessage;
        }
      })
      .addCase(updateMessage.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Message
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        const messageId = action.payload;
        
        // Find and update the message in all chats
        for (const chatId in state.messages) {
          state.messages[chatId] = state.messages[chatId].filter(msg => msg._id !== messageId);
        }

        if (state.currentMessage?._id === messageId) {
          state.currentMessage = null;
        }
      })
      .addCase(deleteMessage.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark as Read
      .addCase(markMessageAsRead.fulfilled, (state, action: PayloadAction<TMessage>) => {
        const updatedMessage = action.payload;
        const chatId = updatedMessage.chat as string;
        
        if (state.messages[chatId]) {
          state.messages[chatId] = state.messages[chatId].map(msg =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          );
        }
      })

      // Search Messages
      .addCase(searchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMessages.fulfilled, (state, action: PayloadAction<TMessage[]>) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMessages.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentMessage,
  addLocalMessage,
  clearSearchResults,
  resetMessages,
} = messageSlice.actions;

export default messageSlice.reducer;