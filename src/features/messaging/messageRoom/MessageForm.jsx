import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import { useState } from "react";
import { sendMessage } from "../chatSlice";

function MessageForm() {
    const [content, setContent] = useState("");
    const dispatch = useDispatch();
    const { accessToken } = useAuth();
    const activeGroupId = useSelector((state) => state.chat.activeGroupId);

    function handleSubmit(e) {
        e.preventDefault();

        if (!content.trim()) return;

        dispatch(
            sendMessage({
                accessToken,
                groupId: activeGroupId,
                content,
            }),
        );

        setContent("");
    }

    return (
        <form onSubmit={handleSubmit} className="flex h-14 gap-2 border-t p-2">
            <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type msg..."
                className="grow rounded-3xl bg-neutral-100 p-2 outline-none placeholder:text-sm placeholder:font-normal placeholder:text-neutral-500"
            />
            <button
                type="submit"
                className="icon-outlined self-center rounded-full bg-neutral-100 px-2 py-1 text-2xl"
            >
                send
            </button>
        </form>
    );
}

export default MessageForm;
