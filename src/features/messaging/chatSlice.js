import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    chatInboxAPI,
    getMessagesAPI,
    sendMessageAPI,
} from "../../services/chat";

const initialState = {
    inbox: [],
    isLoading: false,
    error: null,

    rooms: {},
    activeGroupId: null,
};

export const fetchChatInbox = createAsyncThunk(
    "chat/fetchChatInbox",
    async ({ accessToken }, { rejectWithValue }) => {
        try {
            const res = await chatInboxAPI(accessToken);
            return res;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchRoomMessages = createAsyncThunk(
    "chat/fetchRoomMessages",
    async ({ accessToken, groupId, page }, { rejectWithValue }) => {
        try {
            const res = await getMessagesAPI(accessToken, groupId, page);

            return { groupId, ...res };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async ({ accessToken, groupId, content }, { rejectWithValue }) => {
        try {
            await sendMessageAPI(accessToken, groupId, content);
            return { groupId, content };
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

        setActiveGroup(state, action) {
            state.activeGroupId = action.payload;
        },

        addRealtimeMessage(state, action) {
            const msg = action.payload;
            const room = state.rooms[msg.groupId];

            if (room) {
                room.messages.push(msg);
            }
        },

        receiveGroupMessage(state, action) {
            const msg = action.payload;
            const room = state.rooms[msg.groupId];

            if (!room) return;

            // deduplicate by id
            const exists = room.messages.some((m) => m.id === msg.id);
            if (exists) return;

            room.messages.push(msg);
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
            })

            .addCase(fetchRoomMessages.pending, (state, action) => {
                const { groupId } = action.meta.arg;

                if (state.rooms[groupId]?.isLoading) {
                    return;
                }

                if (!state.rooms[groupId]) {
                    state.rooms[groupId] = {
                        messages: [],
                        page: 1,
                        hasMore: true,
                        isLoading: true,
                    };
                } else {
                    state.rooms[groupId].isLoading = true;
                }
            })

            .addCase(fetchRoomMessages.fulfilled, (state, action) => {
                const { groupId, items, hasMore } = action.payload;
                const room = state.rooms[groupId];

                const existingIds = new Set(room.messages.map((m) => m.id));
                const uniqueItems = items.filter((m) => !existingIds.has(m.id));

                room.messages.unshift(...uniqueItems);
                room.hasMore = hasMore;
                if (!hasMore) return;
                room.page += 1;
                room.isLoading = false;
            })

            .addCase(fetchRoomMessages.rejected, (state, action) => {
                const { groupId } = action.meta.arg;
                if (state.rooms[groupId]) {
                    state.rooms[groupId].isLoading = false;
                }
            });
    },
});

export const {
    resetChat,
    updateInboxLastMessage,
    setActiveGroup,
    receiveGroupMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
