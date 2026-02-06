import { getCleanImageUrl } from "../../services/http";

function ConversationItem({ groupName, userName, msg, grouppic, onChatRoom }) {
    return (
        <div
            className="flex cursor-pointer gap-3 px-3 py-2 transition-all duration-300 ease-in-out hover:bg-tribe-100"
            onClick={(e) => onChatRoom(true)}
        >
            <img
                src={getCleanImageUrl(grouppic)}
                className="h-12 w-12 rounded-full"
            />
            <div>
                <h1 className="text-lg font-semibold">{groupName}</h1>
                <p className="text-sm text-neutral-600">
                    {userName}:{msg}
                </p>
            </div>
        </div>
    );
}

export default ConversationItem;
