import { useDispatch } from "react-redux";
import { getCleanImageUrl } from "../../services/http";
import { setActiveGroup } from "./chatSlice";
import { NavLink } from "react-router-dom";

function ConversationItem({
    groupId,
    groupName,
    userName,
    msg,
    grouppic,
    onChatRoom,
}) {
    const dispatch = useDispatch();
    function handleClick() {
        dispatch(setActiveGroup(groupId));
        onChatRoom?.(true);
    }

    const content = (
        <>
            <img
                src={getCleanImageUrl(grouppic)}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-semibold">{groupName}</h1>
                <p
                    className="max-w-full truncate text-sm text-neutral-700"
                    title={msg}
                >
                    {userName ? `${userName}: ` : ""}
                    {msg}
                </p>
            </div>
        </>
    );

    if (onChatRoom) {
        return (
            <button
                type="button"
                className="relative flex w-full cursor-pointer gap-3 px-3 py-2 text-left transition-all duration-300 ease-in-out hover:bg-neutral-100"
                onClick={handleClick}
            >
                {content}
            </button>
        );
    }

    return (
        <NavLink
            to={`/messages/${groupId}`}
            className={({ isActive }) =>
                `relative flex cursor-pointer gap-3 px-3 py-2 transition-all duration-300 ease-in-out hover:bg-neutral-100 ${
                    isActive ? "bg-neutral-200" : ""
                }`
            }
            onClick={handleClick}
        >
            {content}
        </NavLink>
    );
}

export default ConversationItem;
