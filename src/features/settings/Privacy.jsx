import { useRef, useState } from "react";
import Button from "../../ui/Button";
import coverImg from "../../assets/PostImg.jpeg";
import { useAuth } from "../../contexts/AuthContext";
function Privacy() {
    const [disabled, setDisabled] = useState(true);
    const { user } = useAuth();
    function handleClick() {
        setDisabled((d) => !d);
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

        console.log(file);
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
                            src={user.profilePicture}
                            className="h-12 w-12 rounded-full"
                        />
                        <span className="icon-outlined absolute bottom-2 right-0">
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
            <div className="flex flex-col gap-4 px-4 pb-4">
                <div className="flex gap-3">
                    <input
                        disabled={disabled}
                        className="input flex-1"
                        type="text"
                        name="firstName"
                        defaultValue={"firstName"}
                        required
                    />
                    <input
                        disabled={disabled}
                        className="input flex-1"
                        type="text"
                        name="lastName"
                        defaultValue={"lastName"}
                        required
                    />
                </div>
                <input
                    disabled={disabled}
                    type="text"
                    defaultValue={"+201007058504"}
                    className="input"
                />
                <input
                    disabled={disabled}
                    type="text"
                    defaultValue="userName"
                    className="input"
                />
                <Button onClick={handleClick}>Edit</Button>
            </div>
        </div>
    );
}

export default Privacy;
