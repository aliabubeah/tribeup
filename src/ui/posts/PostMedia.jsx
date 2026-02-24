import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { getCleanImageUrl } from "../../services/http";
import Video from "../Video";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

function PostMedia({ media, rounded = true }) {
    if (!media || media.length === 0) return null;

    return (
        <div className={`overflow-hidden ${rounded ? "rounded-xl" : ""} `}>
            <Swiper
                zoom={{ maxRatio: 3 }}
                modules={[Navigation, Pagination, Zoom]}
                navigation
                pagination={{ clickable: true }}
                className="post-swiper"
            >
                {media.map((item) => (
                    <SwiperSlide key={item.mediaURL}>
                        {item.type === "image" ? (
                            <div className="swiper-zoom-container">
                                <MediaItem media={item} />
                            </div>
                        ) : (
                            <MediaItem media={item} />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

/* ============================= */
/* Media Switcher */
/* ============================= */
function MediaItem({ media }) {
    if (media.type === "Video") {
        return <MediaVideo src={getCleanImageUrl(media.mediaURL)} />;
    }

    // Default to image
    return <MediaImage src={getCleanImageUrl(media.mediaURL)} />;
}

/* ============================= */
/* Image Renderer */
/* ============================= */
function MediaImage({ src }) {
    const [orientation, setOrientation] = useState(null);

    function handleLoad(e) {
        const { naturalWidth, naturalHeight } = e.target;
        setOrientation(naturalHeight > naturalWidth ? "portrait" : "landscape");
    }

    return (
        <div className="flex h-[420px] w-full items-center justify-center bg-black">
            <img
                src={src}
                onLoad={handleLoad}
                className={`h-full w-full transition-opacity duration-150 ${
                    orientation ? "opacity-100" : "opacity-0"
                } ${
                    orientation === "portrait"
                        ? "object-contain"
                        : "object-cover"
                }`}
                alt="Post media"
            />
        </div>
    );
}

function MediaVideo({ src, onResize }) {
    const plyrRef = useRef(null);
    const [orientation, setOrientation] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const video = plyrRef.current?.plyr?.media;
            if (video?.videoWidth && video?.videoHeight) {
                setOrientation(
                    video.videoHeight > video.videoWidth
                        ? "portrait"
                        : "landscape",
                );
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`flex w-full items-center justify-center bg-black ${
                orientation === "portrait" ? "h-[420px]" : "h-[300px]"
            }`}
        >
            <Video ref={plyrRef} src={src} />
        </div>
    );
}

export default PostMedia;
