import MessageForm from "./messageRoom/MessageForm";
import MessageHeader from "./messageRoom/MessageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useRef } from "react";
import { fetchRoomMessages } from "./chatSlice";
import MessageContent from "./messageRoom/MessageContent";

function MessageRoom({ onChatRoom, onClose }) {
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

    /* Scroll to bottom on first load only */
    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el || !room) return;

        if (!didInitialScrollRef.current && room.messages.length) {
            el.scrollTop = el.scrollHeight;
            didInitialScrollRef.current = true;
        }
    }, [room?.messages.length]);

    // reset the anchor when the room changes
    useEffect(() => {
        didInitialScrollRef.current = false;
    }, [activeGroupId]);

    if (!room || !room.messages.length) {
        return (
            <div className="flex h-[60vh] w-[364px] items-center justify-center rounded-lg bg-neutral-50 shadow-xl">
                <span className="text-neutral-500">Loading chat…</span>
            </div>
        );
    }

    return (
        <div className="flex h-[60vh] max-h-[60vh] w-[364px] flex-col rounded-lg bg-neutral-50 shadow-xl">
            {/* room Head */}
            <MessageHeader
                onChatRoom={onChatRoom}
                onClose={onClose}
                groupName={room.messages[0].groupName}
            />

            {/* MainContent */}
            <div
                ref={scrollRef}
                className="grow gap-3 overflow-y-auto px-4 py-3 text-white"
            >
                {room.isLoading && (
                    <div className="py-2 text-center text-xs text-neutral-400">
                        {/* Loading… */}
                    </div>
                )}

                {room.messages.map(
                    ({ content, senderName, senderUserId, sentAt }, i) => (
                        <MessageContent
                            key={i}
                            content={content}
                            senderName={senderName}
                            senderUserId={senderUserId}
                            sentAt={sentAt}
                        />
                    ),
                )}
            </div>

            {/* sendMeesage */}
            <MessageForm />
        </div>
    );
}

export default MessageRoom;
