import { useState } from "react";
import ChatHead from "./ChatHead";
import ConversationList from "./ConversationList";
import MessageRoom from "./MessageRoom";

function ChatDrawer({ onClose }) {
    const [isChatRoom, setIsChatRoom] = useState(false);

    return isChatRoom ? (
        <MessageRoom onChatRoom={setIsChatRoom} onClose={onClose} />
    ) : (
        <div className="flex max-h-[60vh] w-[364px] flex-col gap-2 divide-y overflow-y-auto rounded-lg bg-neutral-50 py-3 shadow-xl">
            <ChatHead onClose={onClose} />
            <ConversationList onChatRoom={setIsChatRoom} />
        </div>
    );
}

export default ChatDrawer;
