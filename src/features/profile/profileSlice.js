import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { profileInfoAPI, userProfileAPI } from "../../services/profile";

const initialState = {
    account: null,
    isLoading: false,
    error: null,
};

export const fetchUserProfile = createAsyncThunk(
    "settings/fetchUserProfile",
    async ({ accessToken, userName }, { rejectWithValue }) => {
        try {
            const res = await userProfileAPI(accessToken, userName);
            return res;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.account = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default profileSlice.reducer;
