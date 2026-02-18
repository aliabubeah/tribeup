import { getCleanImageUrl } from "../../services/http";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import coverImg from "../../assets/PostImg.jpeg";
import avatar from "../../assets/avatar.jpeg";
import Button from "../../ui/Button";
import ProfileFieldInfo from "./ProfileFieldInfo";
import AccountFieldModal from "./AccountFieldModal";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProfileInfo,
    updateCoverPicture,
    updateProfilePicture,
} from "./settingsSlice";
import BackButton from "../../ui/Buttons/BackButton";

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
    const { accessToken } = useAuth();
    const dispatch = useDispatch();
    const { account, isLoading, error } = useSelector(
        (state) => state.settings,
    );

    const [activeField, setActiveField] = useState(null);
    const fileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    useEffect(() => {
        if (!account && accessToken) {
            dispatch(fetchProfileInfo({ accessToken }));
        }
    }, [account, accessToken, dispatch]);

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

    async function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) return;
        if (file.size > 2 * 1024 * 1024) return;

        await dispatch(updateProfilePicture({ accessToken, file })).unwrap();
    }

    async function handleCoverPic(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) return;
        if (file.size > 2 * 1024 * 1024) return;

        await dispatch(updateCoverPicture({ accessToken, file })).unwrap();
    }

    if (isLoading) return <div>loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
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

    const fullName = `${firstName}${lastName}`;
    const displayBio = bio || "You don't have bio yet.";
    const displayPhoneNumber =
        phoneNumber || "You don't have Phone number yet.";

    return (
        <div className="px-3 py-4">
            <BackButton />
            <div className="flex flex-col rounded-lg bg-white">
                <div>
                    <div className="relative rounded-t-lg bg-neutral-200">
                        <div>
                            <img
                                src={coverPicture}
                                className="h-44 w-full rounded-t-lg object-cover"
                            />
                            <span
                                className="icon-outlined absolute left-1/2 top-1/2 cursor-pointer text-xl text-neutral-950"
                                onClick={coverFileDialog}
                            >
                                add_a_photo
                            </span>
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverPic}
                            />
                        </div>
                        <div
                            className="absolute -bottom-6 left-6 flex cursor-pointer"
                            onClick={openFileDialog}
                        >
                            <img
                                src={getCleanImageUrl(profilePicture)}
                                className="h-24 w-24 rounded-full"
                            />
                            <span className="icon-outlined absolute bottom-3 right-1 text-xl text-neutral-50">
                                add_a_photo
                            </span>
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
                        info={`${fullName}`}
                        onEdit={() => openModal("fullName")}
                    />

                    <ProfileFieldInfo
                        title="Phone number"
                        info={`${displayPhoneNumber}`}
                        remove
                        onEdit={() => openModal("phone")}
                        isNull={phoneNumber}
                    />

                    <ProfileFieldInfo
                        title="Bio"
                        info={`${displayBio}`}
                        remove
                        onEdit={() => openModal("bio")}
                        isNull={bio}
                    />

                    <ProfileFieldInfo
                        title="Password"
                        info="************"
                        onEdit={() => openModal("password")}
                    />
                </div>
                <AccountFieldModal
                    field={activeField}
                    isOpen={!!activeField}
                    onClose={closeModal}
                />
            </div>
        </div>
    );
}

export default Account;
