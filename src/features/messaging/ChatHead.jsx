function ChatHead({ onClose }) {
    return (
        <div className="flex items-center justify-between px-4">
            <h1 className="font-semibold">chat</h1>
            <span
                className="icon-outlined cursor-pointer text-xl"
                onClick={onClose}
            >
                arrow_drop_down
            </span>
        </div>
    );
}

export default ChatHead;
