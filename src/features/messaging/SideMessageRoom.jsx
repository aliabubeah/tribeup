import MessageForm from "./messageRoom/MessageForm";
import MessageHeader from "./messageRoom/MessageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useRef } from "react";
import { fetchRoomMessages } from "./chatSlice";
import MessageContent from "./messageRoom/MessageContent";
import { getConnection } from "../../services/siganlR";
import { getDateLabel } from "../../utils/helper";

function SideMessageRoom({ onChatRoom, onClose }) {
    const { accessToken } = useAuth();
    const scrollRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const didInitialScrollRef = useRef(false);

    const dispatch = useDispatch();
    const activeGroupId = useSelector((state) => state.chat.activeGroupId);
    const room = useSelector((state) => state.chat.rooms[activeGroupId]);

    // initial Load
    useEffect(() => {
        if (!activeGroupId) return;

        if (!room) {
            dispatch(
                fetchRoomMessages({
                    accessToken,
                    groupId: activeGroupId,
                    page: 1,
                }),
            );
        }
    }, [activeGroupId, dispatch, accessToken]);

    //  Reverse infinite scroll
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !room) return;

        function handleScroll() {
            if (el.scrollTop === 0 && room.hasMore && !room.isLoading) {
                prevScrollHeightRef.current = el.scrollHeight;

                dispatch(
                    fetchRoomMessages({
                        accessToken,
                        groupId: activeGroupId,
                        page: room.page,
                    }),
                );
            }
        }

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [
        room?.hasMore,
        room?.isLoading,
        room?.page,
        activeGroupId,
        accessToken,
        dispatch,
    ]);

    /* Preserve scroll position after loading older messages */
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        if (prevScrollHeightRef.current > 0) {
            const diff = el.scrollHeight - prevScrollHeightRef.current;
            el.scrollTop = diff;
            prevScrollHeightRef.current = 0;
        }
    }, [room?.messages.length]);

    /* Scroll to bottom on first load or the some one send msgs */
    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el || !room) return;

        // Only run once per room
        if (!didInitialScrollRef.current && room.messages.length) {
            el.scrollTop = el.scrollHeight;
            didInitialScrollRef.current = true;
            return;
        }

        // New message auto scroll (only if near bottom)
        const isNearBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 80;

        if (isNearBottom) {
            el.scrollTop = el.scrollHeight;
        }
    }, [room?.messages.length]);

    // reset the anchor when the room changes
    useEffect(() => {
        didInitialScrollRef.current = false;
    }, [activeGroupId]);

    // signalR
    useEffect(() => {
        if (!activeGroupId) return;

        const connection = getConnection();
        if (!connection) return;

        connection
            .invoke("JoinGroupChat", activeGroupId)
            .catch((err) => console.error("JoinGroup error:", err));

        return () => {
            connection.invoke("LeaveGroupChat", activeGroupId).catch(() => {});
        };
    }, [activeGroupId]);

    if (!room || !room.messages.length) {
        return (
            <div className="flex h-[60vh] w-[364px] items-center justify-center rounded-lg bg-neutral-50 shadow-xl">
                <span className="text-neutral-500">Loading chat…</span>
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-0 w-full flex-col rounded-lg bg-neutral-50 shadow-xl">
            {/* Header */}
            <MessageHeader
                onChatRoom={onChatRoom}
                onClose={onClose}
                groupName={room.messages[0].groupName}
                groupPic={room.messages[0].groupProfilePicture}
            />

            {/* Messages */}
            <div
                ref={scrollRef}
                className="min-h-0 flex-1 gap-3 overflow-y-auto px-4 py-3 text-white"
            >
                {room.isLoading && room.hasMore && (
                    <div className="py-2 text-center text-xs text-neutral-400">
                        Loading…
                    </div>
                )}

                {room.messages.map((msg, i) => {
                    const prevMsg = room.messages[i - 1];

                    const isFirstMessageOfDay =
                        !prevMsg ||
                        new Date(prevMsg.sentAt).toDateString() !==
                            new Date(msg.sentAt).toDateString();

                    const isFirstInSenderGroup =
                        !prevMsg ||
                        isFirstMessageOfDay ||
                        prevMsg.senderUserId !== msg.senderUserId;

                    return (
                        <div key={i}>
                            {/* Date Separator */}
                            {isFirstMessageOfDay && (
                                <div className="my-3 flex justify-center">
                                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900">
                                        {getDateLabel(msg.sentAt)}
                                    </span>
                                </div>
                            )}

                            <MessageContent
                                content={msg.content}
                                senderName={msg.senderName}
                                senderUserId={msg.senderUserId}
                                sentAt={msg.sentAt}
                                senderProfilePic={msg.senderProfilePicture}
                                showAvatar={isFirstInSenderGroup}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Input */}

            <MessageForm className="mb-[63px] md:mb-0" />
        </div>
    );
}

export default SideMessageRoom;
