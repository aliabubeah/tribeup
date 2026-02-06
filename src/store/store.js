import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "../features/feed/feedSlice";
import chatReducer from "../features/messaging/chatSlice.js";

const store = configureStore({
    reducer: {
        feed: feedReducer,
        chat: chatReducer,
    },
});

export default store;
