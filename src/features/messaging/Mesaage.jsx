import { useEffect } from "react";
import ConversationList from "./ConversationList";
import SideMessageRoom from "./SideMessageRoom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatInbox, setActiveGroup } from "./chatSlice";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";

function Mesaage() {
    const { accessToken } = useAuth();
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const chat = useSelector((state) => state.chat);
    const { inbox, isLoading } = chat;
    const activeGroupId = groupId ? Number(groupId) : null;

    useEffect(() => {
        if (!inbox.length && !isLoading) {
            dispatch(fetchChatInbox({ accessToken }));
        }
    }, [accessToken, dispatch, inbox.length, isLoading]);

    useEffect(() => {
        dispatch(setActiveGroup(activeGroupId));
    }, [activeGroupId, dispatch]);

    if (isLoading && !inbox.length) {
        return <p className="p-4 text-neutral-500">Loading chat...</p>;
    }

    return (
        <div className="flex min-h-screen">
            <div
                className={`w-full shrink-0 border-r border-neutral-200 lg:block lg:w-1/3 ${
                    activeGroupId ? "hidden" : "block"
                }`}
            >
                <h1 className="border-b border-neutral-200 p-6 text-3xl font-semibold">
                    Chat
                </h1>
                <ConversationList />
            </div>
            <div
                className={`min-w-0 flex-1 ${activeGroupId ? "block" : "hidden lg:block"}`}
            >
                {activeGroupId ? (
                    <SideMessageRoom />
                ) : (
                    <div className="flex h-screen items-center justify-center text-neutral-500">
                        Select a chat
                    </div>
                )}
            </div>
        </div>
    );
}

export default Mesaage;
