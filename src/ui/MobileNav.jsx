import { NavLink } from "react-router-dom";

function MobileNav() {
    return (
        <div>
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-gray-800 py-2 md:hidden">
                <MobileNavLink to="/" iconName="home" />
                <MobileNavLink to="/search" iconName="Search" />
                <MobileNavLink to="/tribes" iconName="groups" />
                <MobileNavLink to="/notification" iconName="notifications" />
                <MobileNavLink to="/messages" iconName="mail" />
            </nav>
        </div>
    );
}

function MobileNavLink({ to, iconName, end }) {
    return (
        <NavLink to={to} className="p-2" end={end}>
            {({ isActive }) => (
                <span
                    className={`material-symbols-outlined ${isActive ? "icon-filled" : ""}`}
                >
                    {iconName}
                </span>
            )}
        </NavLink>
    );
}

export default MobileNav;
