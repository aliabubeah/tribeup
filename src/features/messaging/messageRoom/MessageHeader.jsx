import avatar from "../../../assets/avatar.jpeg";

function MessageHeader({ onClose, onChatRoom, groupName, groupPic }) {
    return (
        <div className="flex h-[60px] items-center justify-between bg-tribe-500 p-3 text-white">
            <div className="flex items-center gap-2">
                <button
                    className="icon-outlined text-2xl"
                    onClick={(e) => {
                        onChatRoom(false);
                    }}
                >
                    arrow_back
                </button>
                <div className="flex items-center gap-2">
                    <img
                        src={groupPic}
                        alt=""
                        className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                        <h1 className="font-semibold">{groupName}</h1>
                        <p className="text-sm text-tribe-100">Active now</p>
                    </div>
                </div>
            </div>
            <div>
                <button className="icon-outlined" onClick={onClose}>
                    close
                </button>
            </div>
        </div>
    );
}

export default MessageHeader;
