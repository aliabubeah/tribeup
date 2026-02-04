import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatInboxAPI } from "../../services/chat";

const initialState = {
    inbox: [],
    isLoading: false,
    error: null,
};

export const fetchChatInbox = createAsyncThunk(
    "chat/fetchChatInbox",
    async (_, { rejectWithValue }) => {
        try {
            const res = await chatInboxAPI();
            return res;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

const chatSlice = createSlice({
    name: "chat",
    initialState,

    reducers: {
        resetChat(state) {
            state.inbox = [];
            state.error = null;
        },

        updateInboxLastMessage(state, action) {
            const message = action.payload;

            const chat = state.inbox.find((c) => c.groupId === message.groupId);

            if (!chat) return;

            chat.lastMessageContent = message.content;
            chat.lastMessageSenderName = message.userName;
            chat.lastMessageSentAt = message.sentAt;

            // move chat to top
            state.inbox = [
                chat,
                ...state.inbox.filter((c) => c.groupId !== message.groupId),
            ];
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchChatInbox.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(fetchChatInbox.fulfilled, (state, action) => {
                state.inbox = action.payload;
                state.isLoading = false;
            })

            .addCase(fetchChatInbox.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { resetChat, updateInboxLastMessage } = chatSlice.actions;

export default chatSlice.reducer;
