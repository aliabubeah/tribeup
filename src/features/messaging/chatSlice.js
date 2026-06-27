import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    chatInboxAPI,
    deleteMessageAPI,
    editMessageAPI,
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

// ===================== THUNKS ===================== //

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
            const res = await sendMessageAPI(accessToken, groupId, content);
            return res;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const editMessage = createAsyncThunk(
    "chat/editMessage",
    async ({ accessToken, messageId, content }, { rejectWithValue }) => {
        try {
            const res = await editMessageAPI(accessToken, messageId, content);

            return res;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const deleteMessage = createAsyncThunk(
    "chat/deleteMessage",
    async ({ accessToken, messageId }, { rejectWithValue }) => {
        try {
            await deleteMessageAPI(accessToken, messageId);

            return {
                messageId,
            };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

// ===================== SLICE ===================== //

const chatSlice = createSlice({
    name: "chat",
    initialState,

    reducers: {
        resetChat(state) {
            state.inbox = [];
            state.error = null;
        },

        editRealtimeMessage(state, action) {
            const { groupId, id, content } = action.payload;

            const room = state.rooms[groupId];

            if (!room) return;

            const msg = room.messages.find((m) => m.id === id);

            if (msg) {
                msg.content = content;
                msg.isEdited = true;
            }
        },

        deleteRealtimeMessage(state, action) {
            const messageId = action.payload;

            for (const room of Object.values(state.rooms)) {
                const index = room.messages.findIndex(
                    (m) => m.id === messageId,
                );

                if (index !== -1) {
                    room.messages.splice(index, 1);
                    break;
                }
            }
        },

        updateInboxLastMessage(state, action) {
            const message = action.payload;

            const chat = state.inbox.find((c) => c.groupId === message.groupId);

            if (!chat) {
                console.log("Chat not found");
                return;
            }

            chat.lastMessageContent = message.lastMessage;
            chat.lastMessageSentAt = message.sentAt;
            chat.lastMessageSenderName = message.lastMessageSenderName;

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

            const exists = room.messages.some((m) => m.id === msg.id);
            if (exists) return;

            room.messages.push(msg);
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== Inbox =====
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

            // ===== Messages =====
            .addCase(fetchRoomMessages.pending, (state, action) => {
                const { groupId } = action.meta.arg;

                if (state.rooms[groupId]?.isLoading) return;

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

                if (hasMore) {
                    room.page += 1;
                }

                room.isLoading = false;
            })

            .addCase(fetchRoomMessages.rejected, (state, action) => {
                const { groupId } = action.meta.arg;

                if (state.rooms[groupId]) {
                    state.rooms[groupId].isLoading = false;
                }
            })

            // ===== FIXED sendMessage =====
            .addCase(sendMessage.fulfilled, (state, action) => {
                const msg = action.payload;
                const room = state.rooms[msg.groupId];

                if (!room) return;

                // prevent duplicates (important with realtime)
                const exists = room.messages.some((m) => m.id === msg.id);
                if (exists) return;

                room.messages.push(msg);
            });
    },
});

export const {
    resetChat,
    updateInboxLastMessage,
    setActiveGroup,
    receiveGroupMessage,
    editRealtimeMessage,
    deleteRealtimeMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
