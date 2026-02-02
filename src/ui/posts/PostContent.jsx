import { useEffect, useRef, useState } from "react";

function PostContent({ caption }) {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        if (!textRef.current) return;

        const el = textRef.current;
        setIsOverflowing(el.scrollHeight > el.clientHeight);
    }, [caption]);

    if (!caption) return null;

    return (
        <div>
            <p
                ref={textRef}
                className={`${!expanded ? `line-clamp-[3]` : ""} whitespace-pre-wrap break-words leading-relaxed`}
            >
                {caption}
            </p>
            {isOverflowing && !expanded && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(true);
                    }}
                    className="mt-1 text-sm font-medium text-tribe-400 transition-all duration-200 hover:text-tribe-600"
                >
                    Read more
                </button>
            )}
            {expanded && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(false);
                    }}
                    className="mt-1 text-sm font-medium text-tribe-400 transition-all duration-200 hover:text-tribe-600"
                >
                    Show less
                </button>
            )}
        </div>
    );
}

export default PostContent;
