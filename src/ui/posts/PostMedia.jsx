import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Video from "../Video";

function PostMedia({ media }) {
    if (!media || media.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-xl">
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                autoHeight
                pagination={{ clickable: true }}
                className="post-swiper"
            >
                {media.map((item, index) => (
                    <SwiperSlide key={index}>
                        <MediaItem media={item} />
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
        return <MediaVideo src={media.mediaURL} />;
    }

    // Default to image
    return <MediaImage src={media.mediaURL} />;
}

/* ============================= */
/* Image Renderer */
/* ============================= */
function MediaImage({ src }) {
    const [isPortrait, setIsPortrait] = useState(false);

    function handleLoad(e) {
        const { naturalWidth, naturalHeight } = e.target;
        setIsPortrait(naturalHeight > naturalWidth);
    }

    return (
        <div className="flex h-[420px] w-full items-center justify-center bg-black">
            <img
                src={src}
                onLoad={handleLoad}
                className={
                    isPortrait
                        ? "h-full object-contain"
                        : "h-full w-full object-cover"
                }
                alt="Post media"
            />
        </div>
    );
}

function MediaVideo({ src }) {
    return (
        <div className="aspect-video w-full bg-black">
            <Video src={src} />
        </div>
    );
}

export default PostMedia;
