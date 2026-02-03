import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import MobileHeader from "./MobileHeader";
import avatar from "../assets/avatar.jpeg";
import ChatDrawer from "../features/messaging/ChatDrawer";
import { useEffect, useRef, useState } from "react";
import MobileSidebarDrawer from "./MobileSideBarDrawer";
function AppLayout() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const drawerRef = useRef(null);

    // close the drawer when press esc key
    useEffect(() => {
        if (!isChatOpen) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setIsChatOpen(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isChatOpen]);

    // close the drawer when click outside
    useEffect(() => {
        if (!isChatOpen) return;

        function handleClickOutside(e) {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                setIsChatOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isChatOpen]);

    // remove header on scroll
    const [hideHeader, setHideHeader] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const currentY = window.scrollY;

            if (currentY > lastScrollY.current && currentY > 80) {
                // scrolling DOWN
                setHideHeader(true);
            } else {
                // scrolling UP
                setHideHeader(false);
            }

            lastScrollY.current = currentY;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-neutral-100">
            <MobileHeader
                hidden={hideHeader}
                onProfileClick={() => setIsMobileSidebarOpen(true)}
            />
            <MobileSidebarDrawer
                open={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            <div className="pt-14 md:p-0">
                <div className="mx-auto flex w-full max-w-7xl flex-1">
                    {/* SideBar */}
                    <aside className="relative hidden w-16 shrink-0 border-r-2 border-neutral-200 md:block lg:w-64">
                        <Sidebar />
                    </aside>
                    {/* Main Content */}
                    <main className="w-full flex-1 px-4 py-8 md:max-w-[600px]">
                        <Outlet />
                    </main>
                    {/* Right Column */}
                    <aside className="hidden w-80 shrink-0 border border-green-100 xl:block"></aside>
                </div>

                {/* message Drawer appears only on the big screens */}
                <div className="fixed bottom-20 right-20 z-20 hidden md:block">
                    <div
                        className={`absolute bottom-full right-0 mb-4 transform transition-all duration-200 ease-in-out ${
                            isChatOpen
                                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                                : "pointer-events-none translate-y-4 scale-95 opacity-0"
                        } `}
                        ref={drawerRef}
                    >
                        <ChatDrawer onClose={() => setIsChatOpen(false)} />
                    </div>

                    <button
                        className="icon-outlined rounded-full bg-tribe-500 px-4 py-3 text-2xl text-white shadow-lg outline-none transition-all duration-150 ease-in-out hover:bg-tribe-700 active:bg-tribe-400"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => setIsChatOpen((e) => !e)}
                    >
                        mail
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Navigation only on small screens*/}
            <MobileNav />
        </div>
    );
}

export default AppLayout;
