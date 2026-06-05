import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainButton from "../../ui/Buttons/MainButton";
import PrivacySelector from "./TribeSettings/PrivacySelector";
import { CreateGroupAPI } from "../../services/groups";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import ImageCropModal from "../../ui/ImageCropModal";
import getCroppedImg from "../../utils/cropImage";

function CreateTribe() {
    const [cropImage, setCropImage] = useState(null);
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [form, setForm] = useState({
        name: "",
        description: "",
        privacy: "public",
        image: null,
    });

    const [preview, setPreview] = useState(null);

    const canSubmit = form.name.trim();

    function handleImageChange(e) {
        const file = e.target.files?.[0];

        if (!file) return;

        const url = URL.createObjectURL(file);

        setCropImage(url);
        e.target.value = "";
    }

    async function handleCropSave(croppedAreaPixels) {
        const croppedFile = await getCroppedImg(cropImage, croppedAreaPixels);

        setForm((prev) => ({
            ...prev,
            image: croppedFile,
        }));

        setPreview(URL.createObjectURL(croppedFile));

        setCropImage(null);
    }

    const { mutate: createGroup, isPending: isCreating } = useMutation({
        mutationFn: CreateGroupAPI,

        onSuccess: (data) => {
            toast.success("Tribe created successfully");

            navigate(`/tribes/${data.id}`);
        },

        onError: (err) => {
            toast.error(err.message);
        },
    });

    function handleSubmit() {
        createGroup({
            accessToken,

            groupName: form.name.trim(),

            description: form.description.trim(),

            accessibility: form.privacy === "public" ? 0 : 1,

            groupProfilePicture: form.image,
        });
    }

    return (
        <div className="px-4 pb-4">
            <div className="flex items-center gap-2 p-4">
                <button className="icon-outlined" onClick={() => navigate(-1)}>
                    arrow_back
                </button>

                <h1 className="font-semibold">Create new tribe</h1>
            </div>

            <div className="flex flex-col gap-6 rounded-2xl bg-white p-4">
                {/* Image Upload */}
                <div>
                    <h2 className="mb-3 font-medium">Choose Image</h2>

                    <label
                        htmlFor="tribe-image"
                        className="flex h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 transition hover:bg-neutral-100"
                    >
                        {preview ? (
                            <img
                                src={preview}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <>
                                <span className="icon-outlined text-4xl text-neutral-500">
                                    upload
                                </span>

                                <p className="mt-2 text-sm text-neutral-500">
                                    Upload
                                </p>
                            </>
                        )}
                    </label>

                    <input
                        id="tribe-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-4">
                    <input
                        className="input"
                        placeholder="Group name"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />

                    <textarea
                        className="input min-h-28 resize-none"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                </div>

                {/* Privacy */}
                <div>
                    <h2 className="mb-3 font-bold">Privacy</h2>

                    <PrivacySelector
                        value={form.privacy}
                        onChange={(val) =>
                            setForm((prev) => ({
                                ...prev,
                                privacy: val,
                            }))
                        }
                    />
                </div>

                {/* Submit */}
                <MainButton
                    disabled={!canSubmit || isCreating}
                    onClick={handleSubmit}
                    className="!py-3"
                >
                    {isCreating ? "Creating...." : "Create"}
                </MainButton>
            </div>
            {cropImage && (
                <ImageCropModal
                    image={cropImage}
                    aspect={1}
                    onClose={() => setCropImage(null)}
                    onCropComplete={handleCropSave}
                />
            )}
        </div>
    );
}

export default CreateTribe;
