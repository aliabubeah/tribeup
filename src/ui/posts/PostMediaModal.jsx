import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Video from "../Video";
import { getCleanImageUrl } from "../../services/http";
import { useEffect, useRef, useState } from "react";

function PostMediaModal({ media }) {
    if (!media || media.length === 0) return null;

    return (
        <div className="relative h-full w-full bg-black">
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="h-full w-full"
            >
                {media.map((item, index) => (
                    <SwiperSlide
                        key={index}
                        className="flex h-full w-full items-center justify-center"
                    >
                        <ModalMediaItem media={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default PostMediaModal;

function ModalMediaItem({ media }) {
    if (media.type === "Video") {
        return <ModalMediaVideo src={getCleanImageUrl(media.mediaURL)} />;
    }

    return <ModalMediaImage src={getCleanImageUrl(media.mediaURL)} />;
}

function ModalMediaImage({ src }) {
    const [isPortrait, setIsPortrait] = useState(false);

    return (
        <div className="flex h-full w-full items-center justify-center bg-black">
            <img
                src={src}
                onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.target;
                    setIsPortrait(naturalHeight > naturalWidth);
                }}
                className={`h-full ${
                    isPortrait
                        ? "object-contain"
                        : "w-full object-contain md:object-cover"
                }`}
                alt="Post media"
            />
        </div>
    );
}

function ModalMediaVideo({ src }) {
    const plyrRef = useRef(null);
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const video = plyrRef.current?.plyr?.media;
            if (video?.videoWidth && video?.videoHeight) {
                setIsPortrait(video.videoHeight > video.videoWidth);
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-full w-full items-center justify-center bg-black">
            <div
                className={`flex items-center justify-center ${
                    isPortrait
                        ? "h-full max-h-[80vh] w-full max-w-[420px]"
                        : "h-full w-full"
                }`}
            >
                <Video ref={plyrRef} src={src} />
            </div>
        </div>
    );
}
