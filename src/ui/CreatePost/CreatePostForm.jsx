import { useEffect, useState } from "react";
import MainButton from "../Buttons/MainButton";
import { MyGroupsAPI } from "../../services/groups";
import { useAuth } from "../../contexts/AuthContext";
import { createPostAPI } from "../../services/posts";

function CreatePostForm({ onClose, id }) {
    const { accessToken } = useAuth();

    const [groups, setGroups] = useState(null);
    const [caption, setCaption] = useState("");
    const [files, setFiles] = useState([]);
    const [groupId, setGroupId] = useState(id ? String(id) : "");
    const [loading, setLoading] = useState(false);
    const [previewUrls, setPreviewUrls] = useState([]);

    const isCaptionOrMedia = files.length > 0 || caption !== "";
    const isDisabled = Boolean(id);

    async function handleSubmit() {
        try {
            setLoading(true);

            await createPostAPI({
                accessToken,
                groupId: Number(groupId),
                caption,
                accessibility: 0,
                taggedUserIds: [],
                mediaFiles: files,
            });

            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function getGroups() {
            const res = await MyGroupsAPI({ accessToken });
            setGroups(res);

            // Only set default if not coming from tribe page
            if (!id && res?.items?.length > 0) {
                setGroupId(String(res.items[0].id));
            }
        }

        if (accessToken) {
            getGroups();
        }
    }, [accessToken, id]);

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    return (
        <div className="flex flex-col gap-4">
            {/* Select Group */}
            <select
                disabled={isDisabled}
                className="input rounded-lg bg-neutral-50"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
            >
                <option value="" disabled>
                    Select a group
                </option>

                {groups?.items?.map((group) => (
                    <option key={group.id} value={String(group.id)}>
                        {group.groupName}
                    </option>
                ))}
            </select>

            {/* Caption */}
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

            {/* Media Preview */}
            {previewUrls.length > 0 && (
                <MediaGrid
                    images={previewUrls}
                    onRemove={(index) => {
                        setFiles((prev) => prev.filter((_, i) => i !== index));

                        setPreviewUrls((prev) => {
                            URL.revokeObjectURL(prev[index]);
                            return prev.filter((_, i) => i !== index);
                        });
                    }}
                />
            )}

            {/* Upload */}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border bg-neutral-50 px-2 py-1 text-sm font-medium hover:bg-neutral-100">
                <span className="icon-outlined text-xl">
                    add_photo_alternate
                </span>
                Upload
                <input
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => {
                        const selectedFiles = Array.from(e.target.files);
                        if (!selectedFiles.length) return;

                        setFiles((prev) => [...prev, ...selectedFiles]);

                        const newUrls = selectedFiles.map((file) =>
                            URL.createObjectURL(file),
                        );

                        setPreviewUrls((prev) => [...prev, ...newUrls]);

                        e.target.value = null;
                    }}
                />
            </label>

            {/* Submit */}
            <MainButton
                onClick={handleSubmit}
                disabled={!groupId || loading || !isCaptionOrMedia}
                className="!py-4"
            >
                {loading ? "Posting..." : "Post"}
            </MainButton>
        </div>
    );
}

export default CreatePostForm;

function MediaGrid({ images, onRemove }) {
    const count = images.length;
    if (!count) return null;

    return (
        <div className="max-h-[300px] min-h-[100px] w-full overflow-hidden overflow-y-auto rounded-lg">
            {/* 1 Image */}
            {count === 1 && (
                <div className="relative h-full w-full overflow-hidden">
                    <img
                        src={images[0]}
                        className="h-full w-full object-cover"
                    />
                    <RemoveButton onClick={() => onRemove(0)} />
                </div>
            )}

            {/* 2 Images */}
            {count === 2 && (
                <div className="grid h-[300px] grid-cols-2 gap-1">
                    {images.map((img, i) => (
                        <div key={i} className="relative overflow-hidden">
                            <img
                                src={img}
                                className="h-full w-full object-cover"
                            />
                            <RemoveButton onClick={() => onRemove(i)} />
                        </div>
                    ))}
                </div>
            )}

            {/* 3 Images */}
            {count === 3 && (
                <div className="grid h-[300px] grid-rows-2 gap-1">
                    {/* Top row */}
                    <div className="relative overflow-hidden">
                        <img
                            src={images[0]}
                            className="h-full w-full object-cover"
                        />
                        <RemoveButton onClick={() => onRemove(0)} />
                    </div>

                    {/* Bottom row split */}
                    <div className="grid grid-cols-2 gap-1">
                        {images.slice(1).map((img, i) => (
                            <div key={i} className="relative overflow-hidden">
                                <img
                                    src={img}
                                    className="h-full w-full object-cover"
                                />
                                <RemoveButton onClick={() => onRemove(i + 1)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4+ Images */}
            {count >= 4 && (
                <div className="grid h-[380px] grid-cols-2 gap-1">
                    {images.slice(0, 4).map((img, i) => (
                        <div key={i} className="relative overflow-hidden">
                            <img
                                src={img}
                                className="h-full w-full object-cover"
                            />
                            <RemoveButton onClick={() => onRemove(i)} />

                            {i === 3 && count > 4 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-2xl font-bold text-white">
                                    +{count - 4}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ImageItem({ src, onRemove, className = "" }) {
    return (
        <div className="relative">
            <img src={src} className={`w-full object-cover ${className}`} />
            <RemoveButton onClick={onRemove} />
        </div>
    );
}

function RemoveButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
        >
            ✕
        </button>
    );
}
