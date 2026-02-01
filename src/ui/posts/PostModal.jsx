import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostChat from "./PostChat";
import PostMediaModal from "./PostMediaModal";

function PostModal({ post, isOpen = false, onClose }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
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
                            <Dialog.Panel
                                className={`${post.media.length === 0 ? "w-full lg:w-1/2" : "w-full"} h-[80vh] max-w-5xl overflow-hidden bg-white shadow-xl`}
                            >
                                <div
                                    className={`${post.media.length === 0 ? "" : "lg:grid-cols-2"} grid h-full grid-cols-1`}
                                >
                                    {/* LEFT */}
                                    <div
                                        className={`${post.media.length === 0 ? "hidden " : ""}h-full bg-black`}
                                    >
                                        <PostMediaModal media={post.media} />
                                    </div>

                                    {/* RIGHT */}
                                    <div className="flex h-full flex-col border-l outline-none">
                                        <div className="flex flex-col gap-3 border-b p-4">
                                            <PostHeader
                                                userName={post.username}
                                                groupName={post.groupName}
                                                groupPicture={post.groupName}
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
                                        <PostChat />
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
