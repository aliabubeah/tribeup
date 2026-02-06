import avatar from "../../assets/avatar.jpeg";
import MessageForm from "./messageRoom/MessageForm";
import MessageHeader from "./messageRoom/MessageHeader";

function MessageRoom({ onChatRoom, onClose }) {
    return (
        <div className="flex h-[60vh] max-h-[60vh] w-[364px] flex-col rounded-lg bg-neutral-50 shadow-xl">
            {/* room Head */}
            <MessageHeader onChatRoom={onChatRoom} onClose={onClose} />

            {/* MainContent */}
            <div className="grow gap-3 overflow-y-auto px-4 py-3 text-white">
                <div className="flex gap-2">
                    <img src={avatar} alt="" className="h-9 w-9" />
                    <div className="flex flex-col">
                        <p className="text-[9px] text-neutral-400">@username</p>
                        <p className="min-h-7 w-fit max-w-56 break-words rounded-xl bg-neutral-500 px-2 py-1 text-sm font-light">
                            hey how are u doin today? asfdsdf asdf asdlfj
                            as;ldfkja s;lkja lkasjdflkajs dflaskjdf
                            l;asjkdflaskj laskjsdf
                        </p>
                        <p className="text-[9px] text-neutral-400">12:15 PM</p>
                    </div>
                </div>

                <div className="flex flex-col justify-self-end">
                    <p className="min-h-7 w-fit max-w-56 break-words rounded-xl bg-tribe-500 px-2 py-1 text-sm font-light">
                        hey how are u doin today? asfdsdf asdf asdlfj
                    </p>
                    <p className="text-end text-[9px] text-neutral-400">
                        12:15 PM
                    </p>
                </div>
            </div>

            {/* sendMeesage */}
            <MessageForm />
        </div>
    );
}

export default MessageRoom;
