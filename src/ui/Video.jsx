import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import { useRef } from "react";

function Video({ src }) {
    const wrapperRef = useRef(null);
    return (
        <div
            ref={wrapperRef}
            tabIndex={0}
            onClick={() => wrapperRef.current?.focus()}
            className="outline-none"
        >
            <Plyr
                source={{
                    type: "video",
                    sources: [
                        {
                            src,
                            type: "video/mp4",
                        },
                    ],
                }}
                options={{
                    controls: [
                        "play",
                        "progress",
                        "current-time",
                        "mute",
                        "volume",
                        "settings",
                        "fullscreen",
                    ],
                    settings: ["speed"],
                    speed: {
                        selected: 1,
                        options: [0.5, 1, 1.25, 1.5, 2],
                    },

                    autoplay: false,
                    muted: false,
                    displayDuration: true,
                    toggleInvert: true,
                    hideControls: true,
                    seekTime: 10,
                    clickToPlay: true,
                    keyboard: {
                        focused: true,
                        global: false,
                    },
                    autopause: true,
                }}
            />
        </div>
    );
}

export default Video;
