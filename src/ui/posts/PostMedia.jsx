import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function PostMedia({ media }) {
    return (
        <div className="overflow-hidden rounded-xl">
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="post-swiper"
            >
                {media.map((img, index) => (
                    <SwiperSlide key={index}>
                        <MediaImage src={img.mediaURL} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

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
                alt=""
            />
        </div>
    );
}

export default PostMedia;
