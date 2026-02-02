import avatar from "../../assets/avatar.jpeg";

function ConversationItem() {
    return (
        <div className="flex cursor-pointer gap-3 px-3 py-2 transition-all duration-300 ease-in-out hover:bg-tribe-100">
            <img src={avatar} className="h-12 w-12 rounded-full" />
            <div>
                <h1 className="text-lg font-semibold">tribe name</h1>
                <p className="text-sm text-neutral-600">
                    username:msg msg msg msg
                </p>
            </div>
        </div>
    );
}

export default ConversationItem;
