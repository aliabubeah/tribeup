import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { formatTimeOnly } from "../../../utils/helper";
import { getCleanImageUrl } from "../../../services/http";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import MessageActionMenu from "../MessageActionMenu";
import {
    deleteMessage,
    deleteRealtimeMessage,
    editMessage,
    editRealtimeMessage,
} from "../chatSlice";

function MessageContent({
    message,
    content,
    senderName,
    senderUserId,
    sentAt,
    senderProfilePic,
    showAvatar,
    isSameSenderAsPrev,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(content);

    const { user, accessToken } = useAuth();
    const dispatch = useDispatch();

    const isMine = senderUserId === user.id;
    const spacingClass = isSameSenderAsPrev ? "mt-1" : "mt-3";

    let formattedTime = "";

    if (sentAt) {
        const d = new Date(sentAt);

        if (!isNaN(d)) {
            formattedTime = formatTimeOnly(d);
        }
    }

    function handleEdit() {
        setEditedText(content);
        setIsEditing(true);
    }

    function handleSaveEdit() {
        const trimmed = editedText.trim();

        if (!trimmed || trimmed === content) {
            setIsEditing(false);
            return;
        }

        dispatch(
            editMessage({
                accessToken,
                messageId: message.id,
                content: trimmed,
            }),
        );

        setIsEditing(false);
    }

    function handleCancelEdit() {
        setEditedText(content);
        setIsEditing(false);
    }

    function handleDelete() {
        dispatch(
            deleteMessage({
                accessToken,
                messageId: message.id,
            }),
        );
    }

    const bubbleContent = isEditing ? (
        <div className="flex flex-col gap-2">
            <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={2}
                autoFocus
                className="w-56 resize-none rounded-lg border border-neutral-300 p-2 text-sm text-black outline-none"
            />

            <div className="flex justify-end gap-2">
                <button
                    onClick={handleCancelEdit}
                    className="text-xs text-neutral-200 hover:text-white"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSaveEdit}
                    className="rounded-md bg-white px-2 py-1 text-xs text-black"
                >
                    Save
                </button>
            </div>
        </div>
    ) : (
        <>
            <p
                className={`w-fit max-w-56 break-words text-sm font-light ${
                    message?.isDeleted ? "italic text-neutral-300" : ""
                }`}
            >
                {content}
            </p>

            <div className="flex items-center justify-end gap-1">
                {message?.isEdited && !message?.isDeleted && (
                    <span className="text-[8px] text-neutral-200">edited</span>
                )}

                {formattedTime && (
                    <p className="text-[9px] text-neutral-100">
                        {formattedTime}
                    </p>
                )}
            </div>
        </>
    );

    if (isMine) {
        return (
            <div className={`${spacingClass} flex justify-end`}>
                <div className="group relative flex items-center gap-2">
                    {!message?.isDeleted && (
                        <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <MessageActionMenu
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}

                    <div className="rounded-xl bg-tribe-500 px-2 py-1 text-white">
                        {bubbleContent}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${spacingClass} flex gap-2`}>
            {showAvatar && (
                <Link to={`/${senderName}`}>
                    <img
                        src={getCleanImageUrl(senderProfilePic)}
                        alt=""
                        className="h-9 w-9 rounded-full"
                    />
                </Link>
            )}

            <div className="flex flex-col">
                {showAvatar && (
                    <p className="text-[10px] font-medium text-neutral-700">
                        {senderName}
                    </p>
                )}

                <div
                    className={`${
                        !showAvatar ? "ml-11" : ""
                    } rounded-xl bg-neutral-500 px-2 py-1`}
                >
                    <p
                        className={`w-fit max-w-56 break-words text-sm font-light ${
                            message?.isDeleted ? "italic text-neutral-300" : ""
                        }`}
                    >
                        {content}
                    </p>

                    <div className="flex items-center justify-end gap-1">
                        {message?.isEdited && !message?.isDeleted && (
                            <span className="text-[8px] text-neutral-200">
                                edited
                            </span>
                        )}

                        {formattedTime && (
                            <p className="text-right text-[9px] text-neutral-100">
                                {formattedTime}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageContent;
