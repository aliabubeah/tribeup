import MainButton from "../../ui/Buttons/MainButton";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";

function ProfileFieldInfo({ title, info, remove, onEdit }) {
    if (title === "Password") {
        info = "************";
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
                ) : (
                    <div className="flex items-center gap-2">
                        {remove && (
                            <SecondaryButton className="border-red-500 text-red-500 hover:bg-red-50">
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
