import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import MainButton from "../Buttons/MainButton";
import { useAuth } from "../../contexts/AuthContext";
import { EditPostAPI } from "../../services/posts";
import { getCleanImageUrl } from "../../services/http";

function EditPost({ post, isOpen, onClose }) {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();
    const createdPreviewUrlsRef = useRef([]);

    const [caption, setCaption] = useState(post.caption ?? "");
    const [mediaItems, setMediaItems] = useState(() =>
        (post.media ?? []).map((media, index) => ({
            id: getMediaKey(media),
            deleteMediaId: getMediaDeleteId(media, index),
            type: media.type,
            src: getCleanImageUrl(media.mediaURL),
            mediaURL: media.mediaURL,
            kind: "existing",
        })),
    );
    const [deleteMediaIds, setDeleteMediaIds] = useState([]);

    const isCaptionOrMedia =
        caption.trim() !== "" || mediaItems.length > 0;

    const { mutate: editPost, isPending } = useMutation({
        mutationFn: () =>
            EditPostAPI({
                accessToken,
                id: post.postId,
                groupId: post.groupId,
                caption,
                accessibility: post.accessibility ?? 0,
                taggedUserIds: [],
                newMediaFiles: mediaItems
                    .filter((item) => item.kind === "new")
                    .map((item) => item.file),
                deleteMediaIds,
            }),
        onSuccess: () => {
            toast.success("Post updated");
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            queryClient.invalidateQueries({ queryKey: ["tribePosts"] });
            queryClient.invalidateQueries({ queryKey: ["personalPosts"] });
            queryClient.invalidateQueries({
                queryKey: ["post", String(post.postId)],
            });
            cleanupPreviewUrls();
            onClose();
        },
        onError: (err) => {
            toast.error(err.message || "Could not update post");
        },
    });

    function cleanupPreviewUrls() {
        createdPreviewUrlsRef.current.forEach((url) =>
            URL.revokeObjectURL(url),
        );
        createdPreviewUrlsRef.current = [];
    }

    function handleAddFiles(e) {
        const selectedFiles = Array.from(e.target.files ?? []);
        if (!selectedFiles.length) return;

        const nextItems = selectedFiles.map((file) => {
            const previewUrl = URL.createObjectURL(file);
            createdPreviewUrlsRef.current.push(previewUrl);

            return {
                id: `${file.name}-${file.lastModified}-${previewUrl}`,
                type: file.type.startsWith("video/") ? "Video" : "Image",
                src: previewUrl,
                file,
                kind: "new",
            };
        });

        setMediaItems((items) => [...items, ...nextItems]);
        e.target.value = null;
    }

    function handleRemoveMedia(item) {
        setMediaItems((items) =>
            items.filter((mediaItem) => mediaItem.id !== item.id),
        );

        if (item.kind === "new") {
            URL.revokeObjectURL(item.src);
            createdPreviewUrlsRef.current =
                createdPreviewUrlsRef.current.filter((url) => url !== item.src);
            return;
        }

        if (item.deleteMediaId !== undefined && item.deleteMediaId !== null) {
            setDeleteMediaIds((ids) => [...ids, item.deleteMediaId]);
            return;
        }
    }

    function handleClose() {
        cleanupPreviewUrls();
        onClose();
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <div className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="flex max-h-screen w-full max-w-[800px] flex-col gap-4 overflow-hidden rounded-xl bg-white shadow-2xl">
                        <div className="flex items-center border-b px-6 py-4">
                            <button
                                className="icon-outlined text-2xl"
                                onClick={handleClose}
                            >
                                close
                            </button>
                            <h2 className="grow text-center text-xl font-semibold">
                                Edit post
                            </h2>
                        </div>

                        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-8">
                            <select
                                disabled
                                className="input rounded-lg bg-neutral-50"
                                value={String(post.groupId ?? "")}
                                onChange={() => {}}
                            >
                                <option value={String(post.groupId ?? "")}>
                                    {post.groupName}
                                </option>
                            </select>

                            <textarea
                                className="input max-h-[120px] min-h-[50px] resize-none overflow-y-auto rounded-lg bg-neutral-50"
                                placeholder="What's on your mind?"
                                value={caption}
                                onChange={(e) => {
                                    setCaption(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = `${Math.min(
                                        e.target.scrollHeight,
                                        120,
                                    )}px`;
                                }}
                            />

                            {mediaItems.length > 0 && (
                                <EditMediaGrid
                                    mediaItems={mediaItems}
                                    onRemove={handleRemoveMedia}
                                />
                            )}

                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border bg-neutral-50 px-2 py-1 text-sm font-medium hover:bg-neutral-100">
                                <span className="icon-outlined text-xl">
                                    add_photo_alternate
                                </span>
                                Upload
                                <input
                                    type="file"
                                    multiple
                                    hidden
                                    onChange={handleAddFiles}
                                />
                            </label>

                            <MainButton
                                onClick={() => editPost()}
                                disabled={
                                    !isCaptionOrMedia || isPending
                                }
                                className="!py-4"
                            >
                                {isPending ? "Saving..." : "Save changes"}
                            </MainButton>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}

function EditMediaGrid({ mediaItems, onRemove }) {
    return (
        <div className="grid max-h-[320px] min-h-[120px] grid-cols-2 gap-1 overflow-y-auto rounded-lg sm:grid-cols-3">
            {mediaItems.map((item) => (
                <div
                    key={item.id}
                    className="relative aspect-square overflow-hidden bg-neutral-100"
                >
                    {item.type === "Video" ? (
                        <video
                            src={item.src}
                            className="h-full w-full object-cover"
                            muted
                        />
                    ) : (
                        <img
                            src={item.src}
                            className="h-full w-full object-cover"
                            alt=""
                        />
                    )}
                    <RemoveButton onClick={() => onRemove(item)} />
                </div>
            ))}
        </div>
    );
}

function RemoveButton({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold shadow"
        >
            x
        </button>
    );
}

function getMediaBackendId(media) {
    return media.id ?? media.mediaId ?? media.postMediaId;
}

function getMediaDeleteId(media, index) {
    return getMediaBackendId(media) ?? index;
}

function getMediaKey(media) {
    return getMediaBackendId(media) ?? media.mediaURL;
}

export default EditPost;
