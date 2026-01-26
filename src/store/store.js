import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "../features/feed/feedSlice";

const store = configureStore({
    reducer: {
        feed: feedReducer,
    },
});

export default store;
