import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logoutAPI } from "../services/auth";

function Sidebar() {
    const { user, logout, accessToken } = useAuth();
    const navigate = useNavigate();
    function handleClick() {
        logoutAPI(accessToken);
        logout();
        navigate("/login");
    }
    return (
        <div className="h-full px-4 py-6">
            {/* Profile */}
            <div className="mb-8 flex items-center gap-3">
                <img
                    src={user.profilePicture}
                    alt="profile"
                    className="h-10 min-w-10 rounded-full"
                />
            </div>

            <ul className="flex flex-col gap-6">
                <SidebarItem to="/" end icon="home" label="Home" />
                <SidebarItem
                    to="/notifications"
                    icon="notifications"
                    label="Notification"
                />
                <SidebarItem to="/search" icon="search" label="Search" />
                <SidebarItem to="/messaging" icon="mail" label="Chat" />
                <SidebarItem to="/tribes" icon="groups" label="My tribes" />
                <SidebarItem to="/settings" icon="settings" label="Settings" />
                <SidebarItem
                    to="/profile"
                    icon="account_circle"
                    label="Profile"
                />

                {/* Logout */}
                <li>
                    <button
                        onClick={handleClick}
                        className="flex items-center gap-3 text-lg text-red-500"
                    >
                        <span className="icon-outlined text-3xl">logout</span>
                        <span className="hidden lg:inline">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

function SidebarItem({ to, icon, label, end }) {
    return (
        <li>
            <NavLink
                to={to}
                end={end}
                className="flex items-center gap-3 text-lg"
            >
                {({ isActive }) => (
                    <>
                        <span
                            className={`icon-outlined text-3xl ${
                                isActive ? "icon-filled" : ""
                            }`}
                        >
                            {icon}
                        </span>
                        <span
                            className={`hidden text-xl lg:inline ${
                                isActive ? "font-semibold" : ""
                            }`}
                        >
                            {label}
                        </span>
                    </>
                )}
            </NavLink>
        </li>
    );
}

export default Sidebar;
