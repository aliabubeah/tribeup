import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { feedAPI } from "../../services/posts";

/* ============================= */
/* Initial State */
/* ============================= */
const initialState = {
    entities: {}, // postId -> post
    ids: [], // ordered postIds
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null,
};

/* ============================= */
/* Async Thunk (Feed API) */
/* ============================= */
export const fetchFeed = createAsyncThunk(
    "feed/fetchFeed",
    async (accessToken, { getState, rejectWithValue }) => {
        const { hasMore } = getState().feed;

        if (!hasMore) {
            return rejectWithValue("STOP");
        }

        try {
            const res = await feedAPI(accessToken);
            return res;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

/* ============================= */
/* Slice */
/* ============================= */
const feedSlice = createSlice({
    name: "feed",
    initialState,

    reducers: {
        resetFeed(state) {
            state.entities = {};
            state.ids = [];
            state.page = 1;
            state.hasMore = true;
            state.error = null;
        },

        likePostOptimistic(state, action) {
            const post = state.entities[action.payload];
            
            if (post && !post.isLikedByCurrentUser) {
                post.likesCount += 1;
                post.isLikedByCurrentUser = true;
            }
        },
    },

    extraReducers: (builder) => {
        builder
            /* ---------- PENDING ---------- */
            .addCase(fetchFeed.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            /* ---------- FULFILLED ---------- */
            .addCase(fetchFeed.fulfilled, (state, action) => {
                const { items, hasMore } = action.payload;

                items.forEach((post) => {
                    if (!state.entities[post.postId]) {
                        state.ids.push(post.postId);
                    }
                    state.entities[post.postId] = post;
                });

                state.hasMore = hasMore;
                state.page += 1;
                state.isLoading = false;
            })

            /* ---------- REJECTED ---------- */
            .addCase(fetchFeed.rejected, (state, action) => {
                state.isLoading = false;

                if (action.payload === "STOP") return;

                state.error = action.payload;
            });
    },
});

export const { resetFeed, likePostOptimistic } = feedSlice.actions;

export default feedSlice.reducer;
