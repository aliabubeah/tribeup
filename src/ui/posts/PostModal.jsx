import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostChat from "./PostChat";
import PostMediaModal from "./PostMediaModal";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../contexts/AuthContext";
import { fetchComments } from "../../features/comments/commentsSlice";

function PostModal({ post, isOpen = false, onClose }) {
    // const dispatch = useDispatch();
    // const { accessToken } = useAuth();
    // const hasFetchedRef = useRef(false);

    // const commentsState = useSelector(
    //     (state) => state.comments.byPostId[post.postId],
    // );

    // const page = commentsState?.page || 1;

    // ✅ Fetch once per post (kept from optimization)
    // useEffect(() => {
    //     if (!post?.postId) return;

    //     if (!commentsState && !hasFetchedRef.current) {
    //         hasFetchedRef.current = true;

    //         dispatch(
    //             fetchComments({
    //                 accessToken,
    //                 postId: post.postId,
    //                 page,
    //             }),
    //         );
    //     }
    // }, [post.postId, accessToken, dispatch, commentsState]);

    // reset when switching post
    // useEffect(() => {
    //     hasFetchedRef.current = false;
    // }, [post.postId]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* ✅ Overlay (same as ConfirmModal) */}
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    {/* ✅ Panel animation (same pattern) */}
                    <Transition.Child
                        as={Fragment}
                        enter="transition-all duration-150 ease-out"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition-all duration-100 ease-in"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="h-[75vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-xl lg:h-[80vh]">
                            <div
                                className={`grid grid-cols-1 ${
                                    post.media.length === 0
                                        ? ""
                                        : "lg:grid-cols-[auto_1fr]"
                                } h-full overflow-y-auto lg:overflow-hidden`}
                            >
                                {/* LEFT */}
                                <div
                                    className={`${
                                        post.media.length === 0 ? "hidden" : ""
                                    } h-[60vh] overflow-hidden bg-black sm:h-[65vh] lg:h-full`}
                                >
                                    <PostMediaModal media={post.media} />
                                </div>

                                {/* RIGHT */}
                                <div className="flex h-full min-h-0 flex-col border-l outline-none">
                                    <div className="flex flex-col gap-3 border-b p-4">
                                        <PostHeader
                                            userName={post.username}
                                            groupName={post.groupName}
                                            groupPicture={
                                                post.groupProfilePicture
                                            }
                                        />

                                        <div className="min-w-0 text-start">
                                            <PostContent
                                                caption={post.caption}
                                            />
                                        </div>

                                        <PostActions
                                            isLikedByCurrentUser={
                                                post.isLikedByCurrentUser
                                            }
                                            postId={post.postId}
                                            likesCount={post.likesCount}
                                            commentCount={post.commentCount}
                                            createdAt={post.createdAt}
                                        />
                                    </div>

                                    <PostChat postId={post.postId} />
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

export default PostModal;
