import { NavLink, Outlet, useParams } from "react-router-dom";
import BackButton from "../../ui/Buttons/BackButton";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TribeSettings() {
    const { tribeId } = useParams();
    const tabs = [
        { name: "General", path: `/tribes/${tribeId}/settings/general` },
        { name: "Members", path: `/tribes/${tribeId}/settings/members` },
        { name: "Followers", path: `/tribes/${tribeId}/settings/followers` },
    ];

    return (
        <div className="flex flex-col px-8 py-8">
            {/* <BackButton className="text-left" /> */}
            <div className="flex rounded-xl rounded-b-none bg-neutral-100">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.name}
                        to={tab.path}
                        className={({ isActive }) =>
                            classNames(
                                "flex-1 rounded-xl py-2 text-center text-sm font-medium transition",
                                isActive
                                    ? "bg-white text-black shadow-sm"
                                    : "text-gray-500 hover:text-black",
                            )
                        }
                    >
                        {tab.name}
                    </NavLink>
                ))}
            </div>
            <Outlet />
        </div>
    );
}

export default TribeSettings;
