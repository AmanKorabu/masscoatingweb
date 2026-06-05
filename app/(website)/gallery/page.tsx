"use client";

import {
  getBeforeAfterItems,
  getGalleryItems,
} from "@/services/gallerySettings";
import { BeforeAfterGalleryItem, GalleryItem } from "@/types/gallery";
import {
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useMemo, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import BeforeAfterGallerySection from "../_components/BeforeAfterGallerySection";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [beforeAfterItems, setBeforeAfterItems] = useState<
    BeforeAfterGalleryItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);

        const [galleryData, beforeAfterData] = await Promise.all([
          getGalleryItems(),
          getBeforeAfterItems(),
        ]);

        setGalleryItems(
          galleryData
            .filter((item) => item.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder)
        );

        setBeforeAfterItems(
          beforeAfterData
            .filter((item) => item.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder)
        );
      } catch (error) {
        console.log("Failed to load gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = galleryItems
      .map((item) => item.category)
      .filter(Boolean);

    return ["All", ...Array.from(new Set(uniqueCategories))];
  }, [galleryItems]);

  const filteredGallery =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const openPreview = (item: GalleryItem) => {
    setSelectedImage(item);
    setPreviewImageIndex(0);
  };

  const previewImages = selectedImage?.imageUrls || [];
  const currentPreviewImage = previewImages[previewImageIndex];

  const nextPreviewImage = () => {
    if (previewImages.length <= 1) return;

    setPreviewImageIndex((prev) =>
      prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevPreviewImage = () => {
    if (previewImages.length <= 1) return;

    setPreviewImageIndex((prev) =>
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <main className="bg-[#f8fbff]">
        <section className="bg-[#07111f] px-4 py-14 text-white sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mx-auto h-5 w-44 animate-pulse rounded-full bg-white/20" />
            <div className="mx-auto mt-5 h-12 max-w-xl animate-pulse rounded-xl bg-white/20" />
            <div className="mx-auto mt-4 h-5 max-w-2xl animate-pulse rounded-xl bg-white/10" />
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 md:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-[330px] animate-pulse rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200"
                />
              ))}
            </div>

            <div className="mt-10 h-[420px] animate-pulse rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f8fbff]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#07111f] px-4 py-14 text-white sm:px-6 md:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-[-150px] right-[-120px] h-80 w-80 rounded-full bg-cyan-400/20 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100 sm:text-xs">
                  Our Work Gallery
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                Real Work. Real Finish. Real Quality.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Explore our industrial coating, shot blasting, painting and
                finishing work through real project photos and before-after
                transformations.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-3xl font-black">{galleryItems.length}</p>
                  <p className="mt-1 text-xs text-slate-300">Projects</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-3xl font-black">
                    {beforeAfterItems.length}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">Transforms</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-3xl font-black">
                    {Math.max(categories.length - 1, 0)}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">Categories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Before After */}
      <BeforeAfterGallerySection items={beforeAfterItems} />

      {/* Project Gallery */}
      <section className="px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-2xl font-black uppercase tracking-[0.25em] text-blue-600">
                Project Photos
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
                3D Project Showcase
              </h2>
            </div>

            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${activeCategory === category
                      ? "bg-[#07111f] text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredGallery.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-slate-500">No gallery images available.</p>
            </div>
          ) : (
            <div className="rounded-[2rem] bg-white px-2 py-6 shadow-sm ring-1 ring-slate-200 sm:px-4">
              <Swiper
                key={activeCategory}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                loop={filteredGallery.length > 3}
                autoplay={
                  filteredGallery.length > 1
                    ? {
                      delay: 2800,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
                    : false
                }
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 110,
                  modifier: 1,
                  slideShadows: true,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="myGallerySwiper"
              >
                {filteredGallery.map((item) => {
                  const coverImage = item.imageUrls?.[0];

                  return (
                    <SwiperSlide key={item.id}>
                      <article className="relative overflow-hidden rounded-[1.4rem] bg-slate-900 shadow-2xl">
                        <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-white">
                              No Image
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                          <button
                            type="button"
                            onClick={() => openPreview(item)}
                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                          >
                            <EyeOutlined />
                          </button>

                          {item.imageUrls?.length > 1 && (
                            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-slate-950 shadow">
                              {item.imageUrls.length} Photos
                            </span>
                          )}

                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200">
                              {item.category}
                            </p>

                            <h3 className="line-clamp-1 text-xl font-black">
                              {item.title}
                            </h3>

                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-200">
                              {item.description}
                            </p>
                          </div>
                          </div>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}
        </div>
      </section>

      {/* Preview Modal */}
      <Modal
        open={!!selectedImage}
        onCancel={() => setSelectedImage(null)}
        footer={null}
        centered
        width={900}
        className="gallery-preview-modal"
      >
        {selectedImage && (
          <div>
            <div className="relative h-[300px] overflow-hidden rounded-2xl bg-slate-200 sm:h-[520px]">
              {currentPreviewImage ? (
                <img
                  src={currentPreviewImage}
                  alt={selectedImage.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  No Image
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

              {previewImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevPreviewImage}
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    <LeftOutlined />
                  </button>

                  <button
                    type="button"
                    onClick={nextPreviewImage}
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    <RightOutlined />
                  </button>

                  <div className="absolute bottom-5 right-5 flex gap-1.5 rounded-full bg-black/35 px-3 py-2 backdrop-blur-md">
                    {previewImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setPreviewImageIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${index === previewImageIndex
                          ? "w-6 bg-cyan-300"
                          : "w-1.5 bg-white/60"
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
                  {selectedImage.category}
                </p>

                <h2 className="text-2xl font-black sm:text-3xl">
                  {selectedImage.title}
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {selectedImage.description}
            </p>
          </div>
        )}
      </Modal>
    </main>
  );
}