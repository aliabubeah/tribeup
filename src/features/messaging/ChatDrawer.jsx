import ChatHead from "./ChatHead";
import ConversationList from "./ConversationList";

function ChatDrawer({ onClose }) {
    return (
        <div className="flex max-h-[60vh] w-80 flex-col gap-2 divide-y overflow-y-auto rounded-lg bg-neutral-50 py-3 shadow-xl">
            <ChatHead onClose={onClose} />
            <ConversationList />
        </div>
    );
}

export default ChatDrawer;
