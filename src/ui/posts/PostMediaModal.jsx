import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Video from "../Video";

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
                    <SwiperSlide key={index} className="h-full w-full">
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
        return <ModalMediaVideo src={media.mediaURL} />;
    }

    return <ModalMediaImage src={media.mediaURL} />;
}

function ModalMediaImage({ src }) {
    return (
        <div className="relative h-full w-full">
            <img
                src={src}
                className="absolute inset-0 h-full w-full object-cover"
                alt="Post media"
            />
        </div>
    );
}

function ModalMediaVideo({ src }) {
    return (
        <div className="relative h-full w-full">
            <Video src={src} className="absolute inset-0 h-full w-full" />
        </div>
    );
}
