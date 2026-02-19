import { useDispatch, useSelector } from "react-redux";
import MainButton from "../../ui/Buttons/MainButton";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";
import { deleteBio, deletePhone, updatePhoneNumber } from "./settingsSlice";
import { useAuth } from "../../contexts/AuthContext";

function ProfileFieldInfo({ title, info, remove, onEdit, isNull }) {
    const dispatch = useDispatch();
    const { accessToken } = useAuth();

    if (title === "Password") {
        info = "************";
    }

    async function handleRemove() {
        if (title === "Bio") {
            dispatch(deleteBio({ accessToken }));
        } else if (title === "Phone number") {
            dispatch(deletePhone({ accessToken }));
        }
    }

    return (
        <div className="flex items-center justify-between">
            <div className="py-2 pl-4">
                <h1 className="text-sm font-medium">{title}</h1>
                <p className="text-sm">{info}</p>
            </div>
            <div>
                {title === "Password" ? (
                    <MainButton onClick={onEdit}>Change password</MainButton>
                ) : isNull === null ? (
                    <SecondaryButton onClick={onEdit}>Add</SecondaryButton>
                ) : (
                    <div className="flex items-center gap-2">
                        {remove && (
                            <SecondaryButton
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={handleRemove}
                            >
                                Remove
                            </SecondaryButton>
                        )}
                        <SecondaryButton onClick={onEdit}>Edit</SecondaryButton>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileFieldInfo;
