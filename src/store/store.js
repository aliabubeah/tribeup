import { configureStore, combineReducers } from "@reduxjs/toolkit";
import feedReducer from "../features/feed/feedSlice";
import chatReducer from "../features/messaging/chatSlice.js";
import profileReducer from "../features/profile/profileSlice.js";

const appReducer = combineReducers({
    feed: feedReducer,
    chat: chatReducer,
    profile: profileReducer,
});

const rootReducer = (state, action) => {
    if (action.type === "RESET_APP") {
        state = undefined;
    }

    return appReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer,
});

export default store;
