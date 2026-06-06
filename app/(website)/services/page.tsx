"use client";

import { getServices } from "@/services/serviceSettings";
import { ServiceData } from "@/types/service";
import {
  CheckCircleOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  StarOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeImages, setActiveImages] = useState<Record<string, number>>({});
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        const result = await getServices();

        const activeServices = result
          .filter((item) => item.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        setServices(activeServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const changeCardImage = (
    serviceId: string,
    totalImages: number,
    direction: "prev" | "next"
  ) => {
    setActiveImages((prev) => {
      const currentIndex = prev[serviceId] || 0;

      const nextIndex =
        direction === "next"
          ? currentIndex === totalImages - 1
            ? 0
            : currentIndex + 1
          : currentIndex === 0
            ? totalImages - 1
            : currentIndex - 1;

      return {
        ...prev,
        [serviceId]: nextIndex,
      };
    });
  };

  const openServiceModal = (service: ServiceData) => {
    setSelectedService(service);
    setModalImageIndex(0);
  };

  const modalImages = selectedService?.images || [];
  const modalCurrentImage = modalImages[modalImageIndex];

  const nextModalImage = () => {
    if (modalImages.length <= 1) return;

    setModalImageIndex((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevModalImage = () => {
    if (modalImages.length <= 1) return;

    setModalImageIndex((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  };
  if (loading) {
    return (
      <main className="bg-slate-50">
        <section className="bg-[#07111f] px-4 py-12 text-white sm:px-6 md:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mx-auto h-5 w-40 animate-pulse rounded-full bg-white/20" />
            <div className="mx-auto mt-5 h-10 max-w-xl animate-pulse rounded-xl bg-white/20" />
            <div className="mx-auto mt-4 h-5 max-w-2xl animate-pulse rounded-xl bg-white/10" />
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-[1.6rem] bg-white shadow-sm ring-1 ring-slate-200"
              />
            ))}
          </div>
        </section>
      </main>
    );
  }
  return (
    <main>
      {/* Header */}
      <section className="relative overflow-hidden bg-[#07111f] px-4 py-12 text-white sm:px-6 md:py-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-[-150px] right-[-120px] h-80 w-80 rounded-full bg-cyan-400/20 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100 sm:text-xs">
              Mass Coating Services
            </span>
          </div>

          <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Industrial Coating Solutions
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Professional shot blasting, powder coating, industrial painting and
            surface finishing services.
          </p>
        </div>
      </section>

      {/* Services Cards */}
      <section className="relative overflow-hidden bg-[#f8fbff] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-120px] top-20 h-72 w-72 rounded-full bg-blue-100 blur-[100px]" />
          <div className="absolute bottom-[-140px] left-[-120px] h-80 w-80 rounded-full bg-cyan-100 blur-[110px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          {services.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-slate-500">No services available.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const serviceId = service.id || service.title;
                const images = service.images || [];
                const activeImageIndex = activeImages[serviceId] || 0;
                const currentImage = images[activeImageIndex];

                return (
                  <article
                    key={serviceId}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-200 sm:h-52">
                      {currentImage ? (
                        <img
                          src={currentImage}
                          alt={service.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-500">
                          No Image
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />

                      <div className="absolute left-4 top-4 flex items-center gap-2">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-slate-950 shadow">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {service.tag && (
                          <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                            {service.tag}
                          </span>
                        )}
                      </div>

                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              changeCardImage(serviceId, images.length, "prev")
                            }
                            className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/70"
                          >
                            <LeftOutlined />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              changeCardImage(serviceId, images.length, "next")
                            }
                            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/70"
                          >
                            <RightOutlined />
                          </button>

                          <div className="absolute bottom-4 right-4 flex gap-1.5 rounded-full bg-black/35 px-3 py-2 backdrop-blur-md">
                            {images.map((_, imgIndex) => (
                              <button
                                key={imgIndex}
                                type="button"
                                onClick={() =>
                                  setActiveImages((prev) => ({
                                    ...prev,
                                    [serviceId]: imgIndex,
                                  }))
                                }
                                className={`h-1.5 rounded-full transition-all ${imgIndex === activeImageIndex
                                  ? "w-6 bg-cyan-300"
                                  : "w-1.5 bg-white/60"
                                  }`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="line-clamp-1 text-xl font-black text-white">
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <p className=" min-h-[70px] text-sm leading-4 text-slate-600">
                        {service.shortDescription}
                      </p>

                      {service.features?.length > 0 && (
                        <div className="min-h-[84px] space-y-1">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <div
                              key={`${feature}-${i}`}
                              className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                            >
                              <CheckCircleOutlined className="shrink-0 text-blue-600" />
                              <span className="line-clamp-1">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto grid gap-2">
                        <button
                          type="button"
                          onClick={() => openServiceModal(service)}
                          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 transition hover:bg-slate-100"
                        >
                          <EyeOutlined />
                          Quick View
                        </button>

                        {service.slug && (
                          <Link
                            href={`/services/${service.slug}`}
                            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#07111f] text-sm font-bold text-white transition hover:bg-blue-700"
                          >
                            View Full Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <Modal
        open={!!selectedService}
        onCancel={() => setSelectedService(null)}
        footer={null}
        centered
        width={980}
        className="service-detail-modal"
      >
        {selectedService && (
          <div className="overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
              {/* Modal Image */}
              <div className="relative h-[280px] overflow-hidden rounded-2xl bg-slate-200 sm:h-[380px] lg:h-[520px]">
                {modalCurrentImage ? (
                  <img
                    src={modalCurrentImage}
                    alt={selectedService.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    No Image
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {selectedService.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {selectedService.tag}
                  </span>
                )}

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
                    Service Details
                  </p>

                  <h2 className="text-2xl font-black text-white sm:text-4xl">
                    {selectedService.title}
                  </h2>
                </div>

                {modalImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevModalImage}
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                    >
                      <LeftOutlined />
                    </button>

                    <button
                      type="button"
                      onClick={nextModalImage}
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                    >
                      <RightOutlined />
                    </button>

                    <div className="absolute bottom-5 right-5 flex gap-1.5 rounded-full bg-black/35 px-3 py-2 backdrop-blur-md">
                      {modalImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setModalImageIndex(index)}
                          className={`h-1.5 rounded-full transition-all ${index === modalImageIndex
                            ? "w-6 bg-cyan-300"
                            : "w-1.5 bg-white/60"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Modal Content */}
              <div className="flex max-h-[75vh] flex-col overflow-y-auto p-1">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-700">
                  <ToolOutlined />
                  <span className="text-xs font-black uppercase tracking-[0.18em]">
                    Professional Service
                  </span>
                </div>

                <h3 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                  {selectedService.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {selectedService.shortDescription}
                </p>

                {selectedService.fullDescription && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                    <p className="whitespace-pre-line text-sm leading-8 text-slate-600">
                      {selectedService.fullDescription}
                    </p>
                  </div>
                )}

                {selectedService.features?.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Key Features
                    </p>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {selectedService.features.map((feature, index) => (
                        <div
                          key={`${feature}-${index}`}
                          className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
                        >
                          <CheckCircleOutlined className="shrink-0 text-blue-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedService.extraServices?.length ? (
                  <div className="mt-6">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Extra Services
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {selectedService.extraServices.map((item, index) => (
                        <span
                          key={`${item}-${index}`}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-100"
                        >
                          <StarOutlined />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}