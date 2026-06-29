import MessageForm from "./messageRoom/MessageForm";
import MessageHeader from "./messageRoom/MessageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useRef } from "react";
import { fetchRoomMessages } from "./chatSlice";
import MessageContent from "./messageRoom/MessageContent";
import { getConnection } from "../../services/siganlR";
import { getDateLabel } from "../../utils/helper";

function MessageRoom({ onChatRoom, onClose }) {
    const { accessToken } = useAuth();
    const scrollRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const didInitialScrollRef = useRef(false);

    const dispatch = useDispatch();

    const activeGroupId = useSelector((state) => state.chat.activeGroupId);

    const room = useSelector((state) => state.chat.rooms[activeGroupId]);

    const activeChat = useSelector((state) =>
        state.chat.inbox.find((c) => c.groupId === activeGroupId),
    );

    // Initial load
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

    // Reverse infinite scroll
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

    // Preserve scroll position after loading older messages
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        if (prevScrollHeightRef.current > 0) {
            const diff = el.scrollHeight - prevScrollHeightRef.current;

            el.scrollTop = diff;
            prevScrollHeightRef.current = 0;
        }
    }, [room?.messages.length]);

    // Scroll to bottom on first load or new message
    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el || !room) return;

        if (!didInitialScrollRef.current && room.messages.length) {
            el.scrollTop = el.scrollHeight;
            didInitialScrollRef.current = true;
            return;
        }

        const isNearBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 80;

        if (isNearBottom) {
            el.scrollTop = el.scrollHeight;
        }
    }, [room?.messages.length]);

    // Reset when changing rooms
    useEffect(() => {
        didInitialScrollRef.current = false;
    }, [activeGroupId]);

    // SignalR
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

    // Still loading room
    if (!room) {
        return (
            <div className="flex h-[60vh] w-[364px] items-center justify-center rounded-lg bg-neutral-50 shadow-xl">
                <span className="text-neutral-500">Loading chat…</span>
            </div>
        );
    }

    return (
        <div className="flex h-[60vh] max-h-[60vh] w-[364px] flex-col rounded-lg bg-neutral-50 shadow-xl">
            {/* Header */}
            <MessageHeader
                onChatRoom={onChatRoom}
                onClose={onClose}
                groupName={activeChat?.groupName}
                groupPic={activeChat?.groupProfilePicture}
            />

            {/* Messages */}
            <div
                ref={scrollRef}
                className="grow overflow-y-auto px-4 py-3 text-white"
            >
                {room.isLoading && room.hasMore && (
                    <div className="py-2 text-center text-xs text-neutral-400">
                        Loading…
                    </div>
                )}

                {room.messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-neutral-500">
                        No messages yet. Start the conversation 👋
                    </div>
                ) : (
                    room.messages.map((msg, i) => {
                        const prevMsg = room.messages[i - 1];

                        const isFirstMessageOfDay =
                            !prevMsg ||
                            new Date(prevMsg.sentAt).toDateString() !==
                                new Date(msg.sentAt).toDateString();

                        const isFirstInSenderGroup =
                            !prevMsg ||
                            isFirstMessageOfDay ||
                            prevMsg.senderUserId !== msg.senderUserId;

                        const isSameSenderAsPrev =
                            prevMsg &&
                            prevMsg.senderUserId === msg.senderUserId;

                        return (
                            <div key={msg.id}>
                                {isFirstMessageOfDay && (
                                    <div className="my-3 flex justify-center">
                                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900">
                                            {getDateLabel(msg.sentAt)}
                                        </span>
                                    </div>
                                )}

                                <MessageContent
                                    message={msg}
                                    content={msg.content}
                                    senderName={msg.senderName}
                                    senderUserId={msg.senderUserId}
                                    sentAt={msg.sentAt}
                                    senderProfilePic={msg.senderProfilePicture}
                                    showAvatar={isFirstInSenderGroup}
                                    isSameSenderAsPrev={isSameSenderAsPrev}
                                />
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input */}
            <MessageForm />
        </div>
    );
}

export default MessageRoom;
