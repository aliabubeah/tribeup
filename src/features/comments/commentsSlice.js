import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCommentAPI, getPostCommentsAPI } from "../../services/posts";
// import { useAuth } from "../../contexts/AuthContext";
import avatar from "../../assets/avatar.jpeg";

const initialState = {
    byPostId: {},
};

export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async ({ accessToken, postId, page }, { getState, rejectWithValue }) => {
        const postComments = getState().comments.byPostId[postId];

        if (postComments && !postComments.hasMore) {
            return rejectWithValue("STOP");
        }

        try {
            const res = await getPostCommentsAPI(accessToken, postId, page);
            return { postId, ...res };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const addComment = createAsyncThunk(
    "comments/addComment",
    async ({ accessToken, postId, content }, { rejectWithValue }) => {
        try {
            const newComment = await addCommentAPI(
                accessToken,
                postId,
                content,
            );

            return { postId, comment: content };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);
const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        resetComments(state, action) {
            const postId = action.payload;
            delete state.byPostId[postId];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state, action) => {
                const { postId } = action.meta.arg;

                if (!state.byPostId[postId]) {
                    state.byPostId[postId] = {
                        entities: {},
                        ids: [],
                        page: 1,
                        hasMore: true,
                        isLoading: false,
                        error: null,
                    };
                }

                state.byPostId[postId].isLoading = true;
            })

            .addCase(fetchComments.fulfilled, (state, action) => {
                const { postId, items, hasMore } = action.payload;
                const postComments = state.byPostId[postId];

                items.forEach((comment) => {
                    if (!postComments.entities[comment.id]) {
                        postComments.ids.push(comment.id);
                    }
                    postComments.entities[comment.id] = comment;
                });

                postComments.hasMore = hasMore;
                postComments.page += 1;
                postComments.isLoading = false;
            })

            .addCase(fetchComments.rejected, (state, action) => {
                if (action.payload === "STOP") return;

                const { postId } = action.meta.arg;
                state.byPostId[postId].isLoading = false;
                state.byPostId[postId].error = action.payload;
            })
            // addComment
            .addCase(addComment.pending, (state, action) => {
                const { postId, content } = action.meta.arg;

                const postComments = state.byPostId[postId];
                if (!postComments) return;

                const tempId = "local-" + Date.now();

                const tempComment = {
                    id: tempId,
                    content,
                    createdAt: new Date().toISOString(),
                    username: "You",
                    profilePicture: avatar,
                    likesCount: 0,
                };

                postComments.ids.unshift(tempId);
                postComments.entities[tempId] = tempComment;
            })

            .addCase(addComment.fulfilled, (state, action) => {
                const { postId, comment } = action.payload;

                const postComments = state.byPostId[postId];
                if (!postComments) return;

                // Prevent duplicates
                if (!postComments.entities[comment.id]) {
                    postComments.ids.unshift(comment.id); // add to top
                }

                postComments.entities[comment.id] = comment;
                postComments.isAdding = false;
            })

            .addCase(addComment.rejected, (state, action) => {
                const { postId } = action.meta.arg;

                if (!state.byPostId[postId]) return;

                state.byPostId[postId].isAdding = false;
                state.byPostId[postId].error = action.payload;
            });
    },
});

export const { resetComments } = commentsSlice.actions;

export default commentsSlice.reducer;
