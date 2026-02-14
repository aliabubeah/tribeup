import avatar from "../../assets/avatar.jpeg";
import { useSelector } from "react-redux";
import ConversationItem from "./ConversationItem";

function ConversationList({ onChatRoom }) {
    const { inbox } = useSelector((state) => state.chat);

    return (
        <div className="flex flex-col gap-[10px] divide-y">
            {inbox.map((item, i) => (
                <ConversationItem
                    onChatRoom={onChatRoom}
                    groupId={item.groupId}
                    key={i}
                    groupName={item.groupName}
                    userName={item.lastMessageSenderName}
                    msg={item.lastMessageContent}
                    grouppic={item.groupProfilePicture}
                />
            ))}
        </div>
    );
}

export default ConversationList;
