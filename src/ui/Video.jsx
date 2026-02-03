import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import { forwardRef } from "react";

const Video = forwardRef(function Video({ src, onReady }, ref) {
    return (
        <div className="video-root h-full w-full">
            <Plyr
                ref={ref}
                source={{
                    type: "video",
                    sources: [{ src, type: "video/mp4" }],
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
                    autoplay: false,
                    muted: true,
                    hideControls: false,
                }}
                onReady={() => {
                    // wait one frame so controls are laid out
                    requestAnimationFrame(() => {
                        onReady?.();
                    });
                }}
            />
        </div>
    );
});

export default Video;
