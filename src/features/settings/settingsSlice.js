import { createAsyncThunk, createReducer, createSlice } from "@reduxjs/toolkit";
import {
    deleteBioAPI,
    deleteNumberAPI,
    profileInfoAPI,
    updateBioAPI,
    updateCoverPictureAPI,
    updateNameAPI,
    updateNumberAPI,
    updateProfilePictureAPI,
} from "../../services/profile";
import { changePasswordAPI } from "../../services/auth";

const initialState = {
    account: null,
    isLoading: false,
    isUpdating: false,
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

export const udpateFullName = createAsyncThunk(
    "settings/udpateFullName",
    async ({ accessToken, firstName, lastName }, { rejectWithValue }) => {
        try {
            const res = await updateNameAPI(accessToken, firstName, lastName);
            return { firstName, lastName };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const updateBio = createAsyncThunk(
    "settings/updateBio",
    async ({ accessToken, bio }, { rejectWithValue }) => {
        try {
            const res = await updateBioAPI(accessToken, bio);
            return bio;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const deleteBio = createAsyncThunk(
    "settings/delteBio",
    async ({ accessToken }, { rejectWithValue }) => {
        try {
            await deleteBioAPI(accessToken);
            return true;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const updatePhoneNumber = createAsyncThunk(
    "settings/updatePhoneNumber",
    async ({ accessToken, phoneNumber }, { rejectWithValue }) => {
        try {
            const res = await updateNumberAPI(accessToken, phoneNumber);
            return phoneNumber;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const deletePhone = createAsyncThunk(
    "settings/deletePhone",
    async ({ accessToken }, { rejectWithValue }) => {
        try {
            await deleteNumberAPI(accessToken);
            return true;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const updateProfilePicture = createAsyncThunk(
    "settings/updateProfilePicture",
    async ({ accessToken, file }, { rejectWithValue }) => {
        try {
            await updateProfilePictureAPI(accessToken, file);

            return URL.createObjectURL(file);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const updateCoverPicture = createAsyncThunk(
    "settings/updateCoverPicture",
    async ({ accessToken, file }, { rejectWithValue }) => {
        try {
            await updateCoverPictureAPI(accessToken, file);

            return URL.createObjectURL(file);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const updatePassword = createAsyncThunk(
    "settings/updatePassword",
    async (
        { accessToken, currentPassword, newPassword, confirmPassword },
        { rejectWithValue },
    ) => {
        try {
            const res = await changePasswordAPI(
                currentPassword,
                newPassword,
                confirmPassword,
                accessToken,
            );
            return true;
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
            })
            // update Name
            .addCase(udpateFullName.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })

            .addCase(udpateFullName.fulfilled, (state, action) => {
                state.isUpdating = false;

                if (state.account) {
                    state.account.firstName = action.payload.firstName;
                    state.account.lastName = action.payload.lastName;
                }
            })

            .addCase(udpateFullName.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })
            // update Bio
            .addCase(updateBio.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateBio.fulfilled, (state, action) => {
                state.isUpdating = false;
                if (state.account) {
                    state.account.bio = action.payload;
                }
            })
            .addCase(updateBio.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })
            // delete bio
            .addCase(deleteBio.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })

            .addCase(deleteBio.fulfilled, (state) => {
                state.isUpdating = false;

                if (state.account) {
                    state.account.bio = null;
                }
            })

            .addCase(deleteBio.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })

            // update phoneNumber
            .addCase(updatePhoneNumber.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })

            .addCase(updatePhoneNumber.fulfilled, (state, action) => {
                state.isUpdating = false;

                if (state.account) {
                    state.account.phoneNumber = action.payload;
                }
            })

            .addCase(updatePhoneNumber.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })

            // delete number
            .addCase(deletePhone.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })

            .addCase(deletePhone.fulfilled, (state) => {
                state.isUpdating = false;

                if (state.account) {
                    state.account.phoneNumber = null;
                }
            })

            .addCase(deletePhone.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })

            // update pfp
            .addCase(updateProfilePicture.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })

            .addCase(updateProfilePicture.fulfilled, (state, action) => {
                state.isUpdating = false;

                if (state.account) {
                    state.account.profilePicture = action.payload;
                }
            })
            // update cover pic
            .addCase(updateProfilePicture.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })
            .addCase(updateCoverPicture.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })

            .addCase(updateCoverPicture.fulfilled, (state, action) => {
                state.isUpdating = false;

                if (state.account) {
                    state.account.coverPicture = action.payload;
                }
            })
            .addCase(updateCoverPicture.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            });
    },
});

export default settingsSlice.reducer;
