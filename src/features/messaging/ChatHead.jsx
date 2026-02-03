function ChatHead({ onClose }) {
    return (
        <div className="flex items-center justify-between px-4">
            <h1 className="font-semibold">chat</h1>
            <span
                className="icon-outlined cursor-pointer rounded-full px-2 py-1 text-xl transition-all duration-150 ease-out hover:bg-neutral-200"
                onClick={onClose}
            >
                collapse_all
            </span>
        </div>
    );
}

export default ChatHead;
