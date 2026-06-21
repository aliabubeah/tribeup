import { useEffect, useState } from "react";
import ChatHead from "./ChatHead";
import ConversationList from "./ConversationList";
import MessageRoom from "./MessageRoom";
import SideMessageRoom from "./SideMessageRoom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatInbox } from "./chatSlice";
import { useAuth } from "../../contexts/AuthContext";

function Mesaage() {
    const [isChatRoom, setIsChatRoom] = useState(false);
    const { accessToken } = useAuth();
    const dispatch = useDispatch();
    const chat = useSelector((state) => state.chat);
    const { inbox, isLoading } = chat;

    useEffect(() => {
        if (!inbox.length && !isLoading) {
            dispatch(fetchChatInbox({ accessToken }));
        }
    }, [accessToken, dispatch, inbox.length, isLoading]);

    isLoading && <p>Loading chat....</p>;

    return isChatRoom ? (
        <SideMessageRoom onChatRoom={setIsChatRoom} />
    ) : (
        <div className="flex flex-col divide-y divide-neutral-400">
            <div className="px-3 py-6 text-center text-xl font-semibold">
                Chat
            </div>
            <ConversationList onChatRoom={setIsChatRoom} />
        </div>
    );
}

export default Mesaage;
