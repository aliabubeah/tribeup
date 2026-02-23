import { useEffect, useState } from "react";
import MainButton from "../Buttons/MainButton";
import { MyGroupsAPI } from "../../services/groups";
import { useAuth } from "../../contexts/AuthContext";
import { createPostAPI } from "../../services/posts";

function CreatePostForm({ onClose }) {
    const { accessToken } = useAuth();
    const [groups, setGroups] = useState(null);

    const [caption, setCaption] = useState("");
    const [files, setFiles] = useState(null);
    const [groupId, setGroupId] = useState("select a group");
    const [loading, setLoading] = useState(false);

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
            const groups = await MyGroupsAPI(accessToken);
            setGroups(groups);
            if (groups?.length > 0) {
                setGroupId(String(groups[0].id)); // default first group
            }
            console.log(groups);
        }
        getGroups();
    }, [accessToken]);

    return (
        <div className="flex flex-col gap-4">
            <select
                className="input rounded-lg bg-neutral-50"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
            >
                {groups?.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.groupName}
                    </option>
                ))}
            </select>

            <textarea
                className="input min-h-[120px] rounded-lg bg-neutral-50"
                placeholder="What's on your mind?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border bg-neutral-50 p-3 text-sm font-medium hover:bg-neutral-100">
                <span className="icon-outlined text-xl">
                    add_photo_alternate
                </span>
                Upload
                <input
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => setFiles(Array.from(e.target.files))}
                />
            </label>

            <MainButton onClick={handleSubmit} disabled={!groupId || loading}>
                {loading ? "Posting..." : "Post"}
            </MainButton>
        </div>
    );
}

export default CreatePostForm;
