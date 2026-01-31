function PostContent({ caption }) {
    return (
        <div>
            <p className="whitespace-pre-wrap break-words leading-relaxed">
                {caption}
            </p>
        </div>
    );
}

export default PostContent;
