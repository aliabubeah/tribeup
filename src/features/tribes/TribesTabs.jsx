import { NavLink } from "react-router-dom";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TribesTabs() {
    const tabs = [
        { name: "Joined in", path: "/tribes/joined" },
        { name: "Discover", path: "/tribes/discover" },
    ];

    return (
        <div className="flex rounded-lg bg-neutral-100 p-1">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.name}
                    to={tab.path}
                    className={({ isActive }) =>
                        classNames(
                            "flex-1 rounded-[6px] py-2 text-center text-sm font-medium transition",
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
    );
}

export default TribesTabs;
