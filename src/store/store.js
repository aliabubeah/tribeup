import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "../features/feed/feedSlice";
import chatReducer from "../features/messaging/chatSlice.js";
import settingsReducer from "../features/settings/settingsSlice.js";
import commentsReducer from "../features/comments/commentsSlice.js";

const store = configureStore({
    reducer: {
        feed: feedReducer,
        chat: chatReducer,
        settings: settingsReducer,
        comments: commentsReducer,
    },
});

export default store;
