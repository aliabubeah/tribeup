import { useDispatch } from "react-redux";
import { getCleanImageUrl } from "../../services/http";
import { setActiveGroup } from "./chatSlice";

function ConversationItem({
    groupId,
    groupName,
    userName,
    msg,
    grouppic,
    onChatRoom,
}) {
    const dispatch = useDispatch();
    async function handleClick() {
        dispatch(setActiveGroup(groupId));
        onChatRoom(true);
    }

    return (
        <div
            className="flex cursor-pointer gap-3 px-3 py-2 transition-all duration-300 ease-in-out hover:bg-tribe-100"
            onClick={(e) => handleClick()}
        >
            <img
                src={getCleanImageUrl(grouppic)}
                className="h-12 w-12 rounded-full"
            />
            <div className="min-w-0">
                <h1 className="text-lg font-semibold">{groupName}</h1>
                <p
                    className="max-w-full truncate text-sm text-neutral-600"
                    title={msg}
                >
                    {userName}:{msg}
                </p>
            </div>
        </div>
    );
}

export default ConversationItem;
