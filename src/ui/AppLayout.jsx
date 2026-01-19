import { NavLink, Outlet } from "react-router-dom";
// import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

function AppLayout() {
    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="mx-auto flex max-w-7xl">
                {/* SideBar */}
                <aside className="hidden w-16 shrink-0 border border-blue-400 md:block lg:w-64">
                    <Sidebar />
                </aside>
                {/* Main Content */}
                <main className="w-full flex-1 border border-black md:max-w-[600px]">
                    <Outlet />
                </main>
                {/* Right Column */}
                <aside className="hidden w-80 shrink-0 border border-green-100 xl:block"></aside>
            </div>

            {/* Mobile Bottom Navigation only on small screens*/}
            <MobileNav />
        </div>
    );
}

export default AppLayout;
