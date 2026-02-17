import { createAsyncThunk, createReducer, createSlice } from "@reduxjs/toolkit";
import { profileInfoAPI } from "../../services/profile";

const initialState = {
    account: null,
    isLoading: false,
    error: null,
};

export const fetchProfileInfo = createAsyncThunk(
    "settings/fetchProfileInfo",
    async ({ accessToken }, { rejectWithValue }) => {
        try {
            const res = await profileInfoAPI(accessToken);
            return res;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

const settingsSlice = createSlice({
    name: "settings",
    initialState,

    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProfileInfo.fulfilled, (state, action) => {
                state.account = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchProfileInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default settingsSlice.reducer;
