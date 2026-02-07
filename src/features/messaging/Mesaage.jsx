import { useState } from "react";
import ChatHead from "./ChatHead";
import ConversationList from "./ConversationList";
import MessageRoom from "./MessageRoom";

function Mesaage() {
    const [isChatRoom, setIsChatRoom] = useState(false);

    return isChatRoom ? (
        <MessageRoom onChatRoom={setIsChatRoom} />
    ) : (
        <div className="flex flex-col divide-y divide-neutral-400">
            <div className="px-3 py-6 text-center text-xl font-semibold">
                chat
            </div>
            <ConversationList onChatRoom={setIsChatRoom} />
        </div>
    );
}

export default Mesaage;
