function MessageForm() {
    return (
        <form action="" className="flex h-14 gap-2 border-t p-2">
            <input
                type="text"
                className="grow rounded-3xl bg-neutral-200 p-2 outline-none placeholder:text-sm placeholder:font-normal placeholder:text-neutral-500"
                placeholder="Type msg..."
            />
            <button
                type="submit"
                className="icon-outlined self-center rounded-full bg-neutral-200 px-2 py-1 text-2xl"
            >
                send
            </button>
        </form>
    );
}

export default MessageForm;
