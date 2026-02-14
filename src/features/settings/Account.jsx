import { getCleanImageUrl } from "../../services/http";
import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import coverImg from "../../assets/PostImg.jpeg";
import avatar from "../../assets/avatar.jpeg";
import Button from "../../ui/Button";
import ProfileFieldInfo from "./ProfileFieldInfo";
import AccountFieldModal from "./AccountFieldModal";

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
    const { user } = useAuth();
    function openModal(fieldKey) {
        setActiveField(ACCOUNT_FIELDS[fieldKey]);
    }

    function closeModal() {
        setActiveField(null);
    }

    const fileInputRef = useRef(null);

    function openFileDialog() {
        fileInputRef.current?.click();
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        // later:
        // - validate
        // - preview
        // - upload
        if (!file.type.startsWith("image/")) return;
        if (file.size > 2 * 1024 * 1024) return; // 2MB
    }

    return (
        <div className="flex flex-col rounded-lg bg-white">
            <div>
                <div className="relative">
                    <img
                        src={coverImg}
                        alt=""
                        className="h-44 w-full rounded-t-lg object-cover"
                    />
                    <div
                        className="absolute -bottom-6 left-6 flex cursor-pointer"
                        onClick={openFileDialog}
                    >
                        <img
                            src={getCleanImageUrl(user.profilePicture)}
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
                    <h1 className="font-semibold">FullName</h1>
                    <p className="text-neutral-500">@username</p>
                </div>
            </div>
            <div className="flex flex-col gap-3 px-4 pb-4">
                <ProfileFieldInfo
                    title="Full name"
                    info="karimatef"
                    onEdit={() => openModal("fullName")}
                />

                <ProfileFieldInfo
                    title="Phone number"
                    info="+201007058504"
                    remove
                    onEdit={() => openModal("phone")}
                />

                <ProfileFieldInfo
                    title="Bio"
                    info="bla bla bla bla"
                    remove
                    onEdit={() => openModal("bio")}
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
    );
}

export default Account;
