import { useRef, useState } from "react";
import { getCleanImageUrl } from "../../../services/http";
import SecondaryButton from "../../../ui/Buttons/SecondaryButton";
import PrivacySelector from "./PrivacySelector";
import MainButton from "../../../ui/Buttons/MainButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
    deleteGroupAPI,
    deleteGroupPictureAPI,
    GetGroupAPI,
    updateGroupAPI,
    updateGroupPictureAPI,
} from "../../../services/groups";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import ConfirmModal from "../../../ui/ConfirmModal";
import { useConfirm } from "../../../contexts/ConfirmContext";

function General() {
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const { tribeId } = useParams();
    const { accessToken } = useAuth();
    const confirm = useConfirm();
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState(null);
    const navigate = useNavigate();

    const {
        data: tribe,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["tribe", tribeId],
        queryFn: () => GetGroupAPI(accessToken, tribeId),
        // enabled: !!tribeId,
    });

    const queryClient = useQueryClient();

    const { mutate: updateGroup, isPending: isUpdating } = useMutation({
        mutationFn: updateGroupAPI,

        onSuccess: () => {
            toast.success("Group updated successfully");

            queryClient.invalidateQueries({
                queryKey: ["tribe", tribeId],
            });

            setIsEdit(false);
            setForm(null);
        },

        onError: (err) => {
            toast.error(err.message);
        },
    });

    const { mutate: deleteGroup, isPending: isDeleting } = useMutation({
        mutationFn: () =>
            deleteGroupAPI({
                accessToken,
                groupId: tribeId,
            }),

        onSuccess: () => {
            toast.success("Group deleted successfully");
            navigate("/tribes");
        },

        onError: (err) => {
            toast.error(err.message);
        },
    });

    const { mutate: updatePicture, isPending: isUpdatingPicture } = useMutation(
        {
            mutationFn: updateGroupPictureAPI,

            onSuccess: () => {
                toast.success("Picture updated successfully");

                queryClient.invalidateQueries({
                    queryKey: ["tribe", tribeId],
                });

                setSelectedImage(null);
            },

            onError: (err) => {
                toast.error(err.message);
            },
        },
    );

    const { mutate: deletePicture, isPending: isDeletingPicture } = useMutation(
        {
            mutationFn: deleteGroupPictureAPI,

            onSuccess: () => {
                toast.success("Picture removed successfully");

                queryClient.invalidateQueries({
                    queryKey: ["tribe", tribeId],
                });
            },

            onError: (err) => {
                toast.error(err.message);
            },
        },
    );

    // function handleSave() {
    //     updateGroup({
    //         accessToken,
    //         groupId: tribeId,
    //         groupName: form.name.trim(),
    //         description: form.description.trim(),
    //         accessibility: form.privacy === "public" ? 0 : 1,
    //     });
    // }

    async function handleDelete() {
        const ok = await confirm({ type: "deleteGroup" });
        if (!ok) return;
        deleteGroup();
    }

    async function handleDeletePicture() {
        const ok = await confirm({
            type: "deleteGroupPicture",
        });

        if (!ok) return;

        deletePicture({
            accessToken,
            groupId: tribeId,
        });
    }

    function handleImageChange(e) {
        const file = e.target.files?.[0];

        if (!file) return;

        setSelectedImage(file);
    }

    async function handleSave() {
        try {
            // Only update picture if it changed
            if (selectedImage) {
                await updatePicture({
                    accessToken,
                    groupId: tribeId,
                    picture: selectedImage,
                });
            }

            // Only update group info if any text/privacy changed
            const infoChanged =
                form.name !== base.name ||
                form.description !== base.description ||
                form.privacy !== base.privacy;

            if (infoChanged) {
                await updateGroup({
                    accessToken,
                    groupId: tribeId,
                    groupName: form.name.trim(),
                    description: form.description.trim(),
                    accessibility: form.privacy === "public" ? 0 : 1,
                });
            }

            queryClient.invalidateQueries({
                queryKey: ["tribe", tribeId],
            });

            setSelectedImage(null);
            setIsEdit(false);
            setForm(null);
        } catch (err) {
            toast.error(err.message);
        }
    }

    const base = {
        name: tribe.groupName || "",
        description: tribe.description || "",
        privacy: tribe.isPrivate ? "private" : "public",
    };

    const current = isEdit && form ? form : base;

    const hasChanges =
        isEdit &&
        (selectedImage ||
            form?.name !== base.name ||
            form?.description !== base.description ||
            form?.privacy !== base.privacy);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    return (
        <div className="flex flex-col rounded-lg rounded-b-none bg-white">
            {/* Cover */}
            <div className="relative rounded-t-lg bg-neutral-200">
                <img
                    src={
                        selectedImage
                            ? URL.createObjectURL(selectedImage)
                            : getCleanImageUrl(tribe.groupProfilePicture)
                    }
                    className="h-44 w-full rounded-t-lg object-cover"
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
                {isEdit && (
                    <div className="absolute inset-0 flex items-center justify-center gap-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                        >
                            <span className="icon-outlined">photo_camera</span>
                        </button>

                        <button
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/90 text-white transition hover:bg-red-600"
                            onClick={handleDeletePicture}
                        >
                            <span className="icon-outlined">delete</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-8 p-4">
                {/* Inputs */}
                <div className="flex flex-col gap-4">
                    <input
                        className="input"
                        type="text"
                        disabled={!isEdit}
                        value={current.name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />

                    <input
                        className="input"
                        type="text"
                        disabled={!isEdit}
                        value={current.description}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                </div>

                {/* Privacy */}
                <div className="flex flex-col">
                    <h1 className="mb-3 font-bold">Privacy</h1>

                    <PrivacySelector
                        value={current.privacy}
                        onChange={
                            isEdit
                                ? (val) =>
                                      setForm((prev) => ({
                                          ...prev,
                                          privacy: val,
                                      }))
                                : () => {}
                        }
                    />
                </div>

                {/* Buttons */}
                {isEdit ? (
                    <div className="flex items-center justify-center gap-2">
                        <SecondaryButton
                            className="!px-5 !py-3"
                            onClick={() => {
                                setIsEdit(false);
                                setForm(null);
                            }}
                        >
                            Cancel
                        </SecondaryButton>

                        <MainButton
                            className="!px-5 !py-3"
                            disabled={!hasChanges || isUpdating}
                            onClick={handleSave}
                        >
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </MainButton>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <SecondaryButton
                            className="grow !px-5 !py-3"
                            onClick={() => {
                                setForm(base);
                                setIsEdit(true);
                            }}
                        >
                            Edit
                        </SecondaryButton>
                        <MainButton
                            className="grow !bg-red-500 !px-5 !py-3 hover:!bg-red-700"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </MainButton>
                    </div>
                )}
            </div>
        </div>
    );
}

export default General;
