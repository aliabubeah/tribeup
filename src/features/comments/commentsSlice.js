import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    addCommentAPI,
    deletePostCommentAPI,
    editCommentAPI,
    getPostCommentsAPI,
    likeCommentAPI,
} from "../../services/posts";

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
            const res = await addCommentAPI(accessToken, postId, content);

            if (!res.comment) {
                return rejectWithValue(res.message || "Failed");
            }

            return {
                postId,
                comment: res.comment,
            };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const likeComment = createAsyncThunk(
    "comments/likeComment",
    async ({ accessToken, commentId, postId }, { rejectWithValue }) => {
        try {
            const likeComment = await likeCommentAPI(accessToken, commentId);

            return { postId, commentId };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const editComment = createAsyncThunk(
    "comments/editComment",
    async (
        { accessToken, postId, commentId, content },
        { rejectWithValue },
    ) => {
        try {
            const response = await editCommentAPI(
                accessToken,
                commentId,
                content,
            );

            return { postId, comment: response.comment };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async ({ accessToken, postId, commentId }, { rejectWithValue }) => {
        try {
            await deletePostCommentAPI(accessToken, commentId);
            return { postId, commentId };
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
                const { postId, page } = action.meta.arg;

                if (!state.byPostId[postId]) {
                    state.byPostId[postId] = {
                        entities: {},
                        ids: [],
                        page: 1,
                        hasMore: true,
                        isInitialLoading: false,
                        isFetchingMore: false,
                        error: null,
                    };
                }

                const postComments = state.byPostId[postId];

                if (page === 1) {
                    postComments.isInitialLoading = true;
                } else {
                    postComments.isFetchingMore = true;
                }
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
                postComments.isInitialLoading = false;
                postComments.isFetchingMore = false;
            })

            .addCase(fetchComments.rejected, (state, action) => {
                if (action.payload === "STOP") return;

                const { postId } = action.meta.arg;
                const postComments = state.byPostId[postId];
                postComments.isInitialLoading = false;
                postComments.isFetchingMore = false;
                state.byPostId[postId].error = action.payload;
            })
            // addComment
            .addCase(addComment.fulfilled, (state, action) => {
                const { postId, comment } = action.payload;

                const postComments = state.byPostId[postId];
                if (!postComments) return;

                if (!postComments.entities[comment.id]) {
                    postComments.ids.unshift(comment.id);
                }

                postComments.entities[comment.id] = comment;
            })

            .addCase(addComment.rejected, (state, action) => {
                const { postId } = action.meta.arg;
                const postComments = state.byPostId[postId];

                if (!postComments) return;

                postComments.error = action.payload;
            })
            // edit Comment
            .addCase(editComment.pending, (state, action) => {
                const { postId, commentId } = action.meta.arg;
                const postComments = state.byPostId[postId];
                if (!postComments) return;

                const comment = postComments.entities[commentId];
                if (!comment) return;

                comment.isEditing = true;
            })

            .addCase(editComment.fulfilled, (state, action) => {
                const { postId, comment } = action.payload;
                const postComments = state.byPostId[postId];
                if (!postComments) return;

                postComments.entities[comment.id] = {
                    ...postComments.entities[comment.id],
                    ...comment,
                    isEditing: false,
                };
            })

            .addCase(editComment.rejected, (state, action) => {
                const { postId, commentId } = action.meta.arg;
                const postComments = state.byPostId[postId];
                if (!postComments) return;

                const comment = postComments.entities[commentId];
                if (!comment) return;

                comment.isEditing = false;
                postComments.error = action.payload;
            })
            // delete comment
            .addCase(deleteComment.pending, (state, action) => {
                const { postId, commentId } = action.meta.arg;

                const postComments = state.byPostId[postId];
                if (!postComments) return;

                delete postComments.entities[commentId];
                postComments.ids = postComments.ids.filter(
                    (id) => id !== commentId,
                );
            })
            .addCase(deleteComment.fulfilled, () => {})

            .addCase(deleteComment.rejected, (state, action) => {
                const { postId } = action.meta.arg;
                const postComments = state.byPostId[postId];

                if (!postComments) return;

                postComments.hasMore = true;
                postComments.page = 1;
            });
    },
});

export const { resetComments, likeCommentOptimistic } = commentsSlice.actions;

export default commentsSlice.reducer;
