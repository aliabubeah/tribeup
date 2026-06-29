import { getCleanImageUrl } from "../../services/http";
import { useRef, useState } from "react";
import { useConfirm } from "../../contexts/ConfirmContext";

import useDeletePhone from "./hooks/useDeletePhone";
import useProfile from "./hooks/useProfile";
import useUpdateCoverPicture from "./hooks/useUpdateCoverPicture";
import useUpdateProfilePicture from "./hooks/useUpdateProfilePicture";
import useDeleteBio from "./hooks/useDeleteBio";

import BackButton from "../../ui/Buttons/BackButton";
import ProfileFieldInfo from "./ProfileFieldInfo";
import AccountFieldModal from "./AccountFieldModal";
import getCroppedImg from "../../utils/cropImage";
import ImageCropModal from "../../ui/ImageCropModal";

const ACCOUNT_FIELDS = {
    fullName: {
        label: "Full name",
        modalTitle: "Update your name",
        modalDesc: "Enter your new first and last name.",
        type: "fullName",
    },
    phone: {
        label: "Phone number",
        modalTitle: "Update your phone number",
        modalDesc: "Enter your new phone number.",
        type: "phone",
    },
    bio: {
        label: "Bio",
        modalTitle: "Update your bio",
        modalDesc: "Change your current bio",
        type: "bio",
    },
    password: {
        label: "Password",
        modalTitle: "Update your password",
        modalDesc: "Enter your current password and a new password.",
        type: "password",
    },
};

function Account() {
    const [activeField, setActiveField] = useState(null);
    const [cropImage, setCropImage] = useState(null);
    const [cropProfileImage, setCropProfileImage] = useState(null);

    const fileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const confirm = useConfirm();

    const { data: account, isPending: isLoading, error } = useProfile();

    const updateProfilePictureMutation = useUpdateProfilePicture();

    const updateCoverPictureMutation = useUpdateCoverPicture();

    const deleteBioMutation = useDeleteBio();
    const deletePhoneMutation = useDeletePhone();

    function openModal(fieldKey) {
        setActiveField(ACCOUNT_FIELDS[fieldKey]);
    }

    function closeModal() {
        setActiveField(null);
    }

    function openFileDialog() {
        fileInputRef.current?.click();
    }

    function coverFileDialog() {
        coverInputRef.current?.click();
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];

        if (!file) return;
        if (!file.type.startsWith("image/")) return;
        if (file.size > 2 * 1024 * 1024) return;

        const url = URL.createObjectURL(file);

        setCropProfileImage(url);

        e.target.value = "";
    }

    async function handleProfileCropSave(croppedAreaPixels) {
        const croppedFile = await getCroppedImg(
            cropProfileImage,
            croppedAreaPixels,
        );

        await updateProfilePictureMutation.mutateAsync(croppedFile);

        setCropProfileImage(null);
    }

    async function handleCoverPic(e) {
        const file = e.target.files?.[0];

        if (!file) return;
        if (!file.type.startsWith("image/")) return;
        if (file.size > 2 * 1024 * 1024) return;

        const url = URL.createObjectURL(file);

        setCropImage(url);

        e.target.value = "";
    }

    async function handleCoverCropSave(croppedAreaPixels) {
        const croppedFile = await getCroppedImg(cropImage, croppedAreaPixels);

        await updateCoverPictureMutation.mutateAsync(croppedFile);

        setCropImage(null);
    }

    async function handleDeletePhone() {
        const ok = await confirm({
            type: "deletePhone",
        });

        if (!ok) return;

        await deletePhoneMutation.mutateAsync();
    }

    async function handleDeleteBio() {
        const ok = await confirm({
            type: "deleteBio",
        });

        if (!ok) return;

        await deleteBioMutation.mutateAsync();
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div className="text-red-500">
                {error?.message || "Something went wrong"}
            </div>
        );
    }

    if (!account) return null;

    const {
        firstName,
        lastName,
        userName,
        bio,
        phoneNumber,
        profilePicture,
        coverPicture,
    } = account;

    const fullName = `${firstName} ${lastName}`;

    const displayBio = bio || "You don't have bio yet.";

    const displayPhoneNumber =
        phoneNumber || "You don't have Phone number yet.";

    return (
        <div className="px-3 py-4">
            <BackButton />

            <div className="flex flex-col rounded-lg bg-white">
                <div>
                    <div className="relative rounded-t-lg bg-neutral-200">
                        <div className="group relative">
                            <img
                                src={getCleanImageUrl(coverPicture)}
                                className="h-44 w-full rounded-t-lg object-cover"
                                alt="Cover"
                            />

                            <div
                                onClick={coverFileDialog}
                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-t-lg bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100"
                            >
                                <span className="icon-outlined rounded-full bg-white/90 p-3 text-2xl text-neutral-800 shadow-lg">
                                    photo_camera
                                </span>
                            </div>
                        </div>
                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverPic}
                        />
                        <div
                            className="group absolute -bottom-6 left-6 cursor-pointer"
                            onClick={openFileDialog}
                        >
                            <img
                                src={getCleanImageUrl(profilePicture)}
                                className="h-24 w-24 rounded-full object-cover"
                                alt="Profile"
                            />

                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                                <span className="icon-outlined rounded-full bg-white/90 p-2 text-xl text-neutral-800 shadow-lg">
                                    photo_camera
                                </span>
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="relative p-6 pt-12">
                        <h1 className="font-semibold">{fullName}</h1>

                        <p className="text-neutral-500">@{userName}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 px-4 pb-4">
                    <ProfileFieldInfo
                        title="Full name"
                        info={fullName}
                        onEdit={() => openModal("fullName")}
                    />

                    <ProfileFieldInfo
                        title="Phone number"
                        info={displayPhoneNumber}
                        remove
                        isNull={phoneNumber}
                        onEdit={() => openModal("phone")}
                        onRemove={handleDeletePhone}
                    />

                    <ProfileFieldInfo
                        title="Bio"
                        info={displayBio}
                        remove
                        isNull={bio}
                        onEdit={() => openModal("bio")}
                        onRemove={handleDeleteBio}
                    />

                    <ProfileFieldInfo
                        title="Password"
                        info="************"
                        onEdit={() => openModal("password")}
                    />
                </div>

                <AccountFieldModal
                    key={activeField?.type}
                    account={account}
                    field={activeField}
                    isOpen={!!activeField}
                    onClose={closeModal}
                />
            </div>
            {cropProfileImage && (
                <ImageCropModal
                    image={cropProfileImage}
                    aspect={1}
                    cropShape="round"
                    onClose={() => setCropProfileImage(null)}
                    onCropComplete={handleProfileCropSave}
                />
            )}

            {cropImage && (
                <ImageCropModal
                    image={cropImage}
                    aspect={16 / 5}
                    onClose={() => setCropImage(null)}
                    onCropComplete={handleCoverCropSave}
                />
            )}
        </div>
    );
}

export default Account;
