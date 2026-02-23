import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    addCommentAPI,
    getPostCommentsAPI,
    likeCommentAPI,
} from "../../services/posts";
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
    async (
        { accessToken, postId, content, userPic, userName },
        { rejectWithValue },
    ) => {
        try {
            const newComment = await addCommentAPI(
                accessToken,
                postId,
                content,
            );

            return { postId, comment: newComment };
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

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        resetComments(state, action) {
            const postId = action.payload;
            delete state.byPostId[postId];
        },

        likeCommentOptimistic(state, action) {
            const { postId, commentId } = action.payload;

            const postComments = state.byPostId[postId];
            if (!postComments) return;

            const comment = postComments.entities[commentId];
            if (!comment) return;

            if (comment.isLikedByCurrentUser) {
                comment.likesCount -= 1;
                comment.isLikedByCurrentUser = false;
            } else {
                comment.likesCount += 1;
                comment.isLikedByCurrentUser = true;
            }
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
            .addCase(addComment.pending, (state, action) => {
                const { postId, content, userPic, userName } = action.meta.arg;

                const postComments = state.byPostId[postId];
                if (!postComments) return;

                const tempId = "local-" + Date.now();

                const tempComment = {
                    id: tempId,
                    content,
                    createdAt: new Date().toISOString(),
                    username: userName,
                    profilePicture: userPic,
                    likesCount: 0,
                };

                postComments.ids.unshift(tempId);
                postComments.entities[tempId] = tempComment;
            })

            .addCase(addComment.rejected, (state, action) => {
                const { postId } = action.meta.arg;
                const postComments = state.byPostId[postId];
                if (!postComments) return;

                const tempId = postComments.ids.find((id) =>
                    id.startsWith("local-"),
                );

                if (tempId) {
                    delete postComments.entities[tempId];
                    postComments.ids = postComments.ids.filter(
                        (id) => id !== tempId,
                    );
                }
            });
    },
});

export const { resetComments, likeCommentOptimistic } = commentsSlice.actions;

export default commentsSlice.reducer;
