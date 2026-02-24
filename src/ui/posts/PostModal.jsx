import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostChat from "./PostChat";
import PostMediaModal from "./PostMediaModal";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../contexts/AuthContext";
import { fetchComments } from "../../features/comments/commentsSlice";

function PostModal({ post, isOpen = false, onClose }) {
    const dispatch = useDispatch();
    const { accessToken } = useAuth();

    const commentsState = useSelector(
        (state) => state.comments.byPostId[post.postId],
    );

    const page = commentsState?.page || 1;

    useEffect(() => {
        if (!isOpen || !post.postId) return;

        if (!commentsState) {
            dispatch(fetchComments({ accessToken, postId: post.postId, page }));
        }
    }, [isOpen, post.postId, accessToken, dispatch]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
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
                                        className={` ${post.media.length === 0 ? "hidden" : ""} h-[60vh] overflow-hidden bg-black sm:h-[65vh] lg:h-full lg:min-h-0`}
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
                </div>
            </Dialog>
        </Transition>
    );
}

export default PostModal;
