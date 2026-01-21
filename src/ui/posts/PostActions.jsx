function PostActions({
    timestamp = "June 20, 2021",
    likes = 10,
    comments = 12,
}) {
    return (
        <footer className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1">
                        <span className="icon-outlined text-xl">favorite</span>{" "}
                        {likes}
                    </button>
                    <button className="flex items-center gap-1">
                        <span className="icon-outlined text-xl">
                            add_comment
                        </span>{" "}
                        {comments}
                    </button>
                </div>
                <button className="icon-outlined text-xl">link</button>
            </div>

            <p className="mt-2 text-xs text-neutral-600">{timestamp}</p>
        </footer>
    );
}

export default PostActions;
