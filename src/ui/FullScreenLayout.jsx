import { Outlet } from "react-router-dom";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

function FullScreenLayout() {
    return (
        <>
            <div className="flex h-screen flex-col bg-neutral-50">
                <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden">
                    {/* SideBar */}
                    <aside className="relative hidden w-16 shrink-0 border-r-2 border-neutral-200 pt-8 md:block lg:w-64">
                        <Sidebar />
                    </aside>

                    {/* Main Content */}
                    <main className="w-full flex-1 overflow-hidden">
                        <Outlet />
                    </main>
                </div>

                {/* MobileNav */}
            </div>
            <MobileNav />
        </>
    );
}

export default FullScreenLayout;
