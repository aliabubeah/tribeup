import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { fetchProfileInfo } from "./settingsSlice";

function Settings() {
    return (
        <div className="mx-4 my-6 cursor-pointer divide-y divide-neutral-200 rounded-xl bg-white">
            <SettingCard
                iconName="account_circle"
                title="Account"
                description="Edit your profile information"
                to="account"
            />
            <SettingCard
                iconName="account_circle"
                title="Privacy & Security"
                description="Edit your profile information"
                to="privacy"
            />
            <SettingCard
                iconName="account_circle"
                title="Avatar"
                description="Edit your profile information"
            />
            <SettingCard
                iconName="account_circle"
                title="About"
                description="Edit your profile information"
            />
        </div>
    );
}

function SettingCard({ iconName, title, description, to }) {
    const navigate = useNavigate();
    function handleClick() {
        navigate(to);
    }
    return (
        <div className="flex justify-between px-4 py-2" onClick={handleClick}>
            <div className="flex gap-3">
                <span className="icon-outlined self-center text-4xl">
                    {iconName}
                </span>
                <div>
                    <h1 className="text-lg font-medium">{title}</h1>
                    <p className="text-xs text-neutral-600">{description}</p>
                </div>
            </div>
            <span className="icon-outlined self-center text-xl text-neutral-500">
                chevron_right
            </span>
        </div>
    );
}
export default Settings;
