import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import MobileNav from "./MobileNav";
import { useAuth } from "../contexts/AuthContext";
import { logoutAPI } from "../services/auth";
import { getCleanImageUrl } from "../services/http";

function ChatLayout() {
    return (
        <>
            <div className="flex min-h-screen flex-col bg-neutral-50">
                <div className="flex w-full flex-1">
                    {/* SideBar */}
                    <aside className="relative hidden w-24 shrink-0 border-r-2 border-neutral-200 pt-8 md:block">
                        <ChatSidebar />
                    </aside>

                    {/* Main Content */}
                    <main className="w-full flex-1 pb-16 md:p-0">
                        <Outlet />
                    </main>
                </div>

                {/* MobileNav */}
                <MobileNav />
            </div>
        </>
    );
}

export default ChatLayout;

function ChatSidebar() {
    const { user, logout, accessToken } = useAuth();
    const username = user?.userName;
    const navigate = useNavigate();

    if (!user) return null;

    function handleClick() {
        logoutAPI(accessToken);
        logout();
        navigate("/auth/login");
    }

    return (
        <div className="fixed h-full">
            {/* Profile */}
            <div className="mb-8 flex justify-center gap-2 px-2">
                <Link to={`/${username}`}>
                    <img
                        src={getCleanImageUrl(user.profilePicture)}
                        alt="profile"
                        className="h-12 min-w-12 rounded-full object-cover"
                    />
                </Link>
                <div className="flex-col md:hidden">
                    <h1 className="font-semibold">{user.fullName}</h1>
                    <p className="text-sm text-neutral-700">@{user.userName}</p>
                </div>
            </div>

            <ul className="flex flex-col items-center gap-4">
                <ChatSidebarItem to="/" end icon="home" label="Home" />
                <ChatSidebarItem
                    to="/notifications"
                    icon="notifications"
                    label="Notification"
                />
                <ChatSidebarItem
                    to="/leaderboard"
                    icon="leaderboard"
                    label="LeaderBoard"
                />

                <ChatSidebarItem to="/messages" icon="mail" label="Chat" />
                <ChatSidebarItem to="/tribes" icon="groups" label="Tribes" />
                <ChatSidebarItem
                    to="/settings"
                    icon="settings"
                    label="Settings"
                />
                <ChatSidebarItem
                    to={`/${username}`}
                    icon="account_circle"
                    label="Profile"
                />

                {/* Logout */}
                <li>
                    <button
                        onClick={handleClick}
                        className="flex items-center gap-3 rounded-3xl px-3 py-1 text-lg text-red-500 transition-all duration-100 ease-out hover:bg-neutral-200"
                    >
                        <span className="icon-outlined text-3xl">logout</span>
                        <span className="md:hidden">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

function ChatSidebarItem({ to, icon, label, end }) {
    return (
        <li>
            <NavLink
                to={to}
                end={end}
                className="flex items-center gap-3 rounded-3xl px-3 py-1 text-start text-lg transition-all duration-100 ease-out hover:bg-neutral-200"
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
                            className={`text-xl md:hidden ${
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
