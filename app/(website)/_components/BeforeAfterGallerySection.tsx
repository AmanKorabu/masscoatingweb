"use client";

import { BeforeAfterGalleryItem } from "@/types/gallery";
import {
    ArrowRightOutlined,
    CheckCircleOutlined,
    SwapOutlined,
} from "@ant-design/icons";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

type BeforeAfterGallerySectionProps = {
    items: BeforeAfterGalleryItem[];
};

export default function BeforeAfterGallerySection({
    items,
}: BeforeAfterGallerySectionProps) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden bg-[#f8fbff] px-4 py-12 sm:px-6 md:py-14 lg:px-8">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-140px] top-16 h-72 w-72 rounded-full bg-blue-100 blur-[110px]" />
                <div className="absolute bottom-[-160px] right-[-130px] h-80 w-80 rounded-full bg-cyan-100 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
                            <SwapOutlined className="text-blue-600" />

                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 sm:text-xs">
                                Transformations
                            </span>
                        </div>

                        <h2 className="max-w-2xl text-2xl font-black leading-tight text-slate-950 sm:text-3xl md:text-4xl">
                            Before & After Showcase
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                            Real transformation work showing the difference before treatment
                            and after our industrial finishing process.
                        </p>
                    </div>

                    <div className="hidden rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200 lg:block">
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <CheckCircleOutlined className="text-blue-600" />
                            Real project transformation work
                        </div>
                    </div>
                </div>

                {/* 3D Showcase */}
                <div className="overflow-hidden rounded-[2rem] bg-white px-2 py-6 shadow-sm ring-1 ring-slate-200 sm:px-4 lg:px-8 lg:py-8">
                    <Swiper
                        effect="coverflow"
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView="auto"
                        loop={items.length > 3}
                        autoplay={
                            items.length > 1
                                ? {
                                    delay: 3000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }
                                : false
                        }
                        coverflowEffect={{
                            rotate: 18,
                            stretch: 10,
                            depth: 120,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[EffectCoverflow, Pagination, Autoplay]}
                        className="beforeAfterSwiper"
                    >
                        {items.map((item) => (
                            <SwiperSlide key={item.id || item.title}>
                                <article className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-white shadow-xl ring-1 ring-slate-200">
                                    {/* Images */}
                                    {/* Images */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                                        <div className="grid h-full grid-cols-2">
                                            {/* Before */}
                                            <div className="relative h-full overflow-hidden">
                                                {item.beforeImageUrl ? (
                                                    <img
                                                        src={item.beforeImageUrl}
                                                        alt={`${item.title} before`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                                        No Before Image
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                                                <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow">
                                                    Before
                                                </span>
                                            </div>

                                            {/* After */}
                                            <div className="relative h-full overflow-hidden">
                                                {item.afterImageUrl ? (
                                                    <img
                                                        src={item.afterImageUrl}
                                                        alt={`${item.title} after`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                                        No After Image
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                                                <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow">
                                                    After
                                                </span>
                                            </div>
                                        </div>

                                        <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-[#07111f] text-white shadow-xl">
                                            <ArrowRightOutlined />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    {/* <div className="flex h-[32%] flex-col justify-center p-4 sm:p-5">
                                        <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                                            <SwapOutlined />
                                            {item.category}
                                        </div>

                                        <h3 className="line-clamp-1 text-lg font-black text-slate-950 sm:text-xl">
                                            {item.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                                            {item.description}
                                        </p>
                                    </div> */}
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}   