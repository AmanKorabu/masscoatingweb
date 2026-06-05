"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getHeroSettings } from "@/services/heroSettings";
import { HeroData } from "@/types/hero";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import CustomersSection from "./_components/CustomersSection";
import AboutPreviewSection from "./_components/AboutPreviewSection";


export default function HomePage() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchHero = async () => {
      const data = await getHeroSettings();
      setHeroData(data);
    };

    fetchHero();
  }, []);

  const images = heroData?.images || [];

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>


      <main>
        <section className="relative min-h-[620px] overflow-hidden bg-[#07111f] sm:min-h-[calc(100dvh-88px)]">        {/* Background Slider */}
          <div className="absolute inset-0">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[1300ms] ${index === activeImage
                    ? "scale-100 opacity-100"
                    : "scale-105 opacity-0"
                    }`}
                  style={{ backgroundImage: `url("${image}")` }}
                />
              ))
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#07111f] via-[#0d2847] to-[#123b63]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/72 to-[#020617]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/85 via-transparent to-transparent" />

            {/* classy light accents */}
            <div className="absolute left-0 top-0 h-full w-1/2 bg-blue-500/10 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-[100px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex min-h-[620px] items-center px-4 py-8 sm:min-h-[calc(100dvh-88px)] sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <div className="max-w-4xl text-white">
                {/* Badge */}
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <ThunderboltOutlined className="text-cyan-300" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-100 sm:text-xs">
                    Surface Treatment & Industrial Coating
                  </span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  {heroData?.title}
                </h1>

                {/* Subtitle */}
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base md:text-lg">
                  {heroData?.subtitle}
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={heroData?.buttonLink || "/get-quote"}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.02] sm:w-auto sm:text-base"
                  >
                    {heroData?.buttonText || "Get Quote"}
                    <ArrowRightOutlined className="transition group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/services"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto sm:text-base"
                  >
                    Explore Services
                  </Link>
                </div>

                {/* Elegant Info Strip */}
                <div className="mt-6 grid max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] backdrop-blur-md sm:mt-10 sm:grid-cols-3">
                  <div className="border-b border-white/10 p-4 sm:border-b-0 sm:border-r">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <CheckCircleOutlined />
                      <span className="text-sm font-semibold text-white">
                        Shot Blasting
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      Clean surface preparation for strong coating adhesion.
                    </p>
                  </div>

                  <div className="border-b border-white/10 p-4 sm:border-b-0 sm:border-r">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <CheckCircleOutlined />
                      <span className="text-sm font-semibold text-white">
                        Powder Coating
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      Durable finish with professional industrial appearance.
                    </p>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <CheckCircleOutlined />
                      <span className="text-sm font-semibold text-white">
                        Industrial Painting
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      Protective coating solutions for metal components.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Counter + Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-md">
              <span className="text-xs font-medium text-white/80">
                {String(activeImage + 1).padStart(2, "0")}
              </span>

              <div className="flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === activeImage
                      ? "w-8 bg-cyan-300"
                      : "w-2 bg-white/45 hover:bg-white"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <span className="text-xs font-medium text-white/60">
                {String(images.length).padStart(2, "0")}
              </span>
            </div>
          )}
        </section>
        <CustomersSection />
      
        <AboutPreviewSection />
        {/* this will used for footer */}
        {/* <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Our Commitment to Quality</h2>
          <p className="mt-4 text-sm text-slate-600">
            At Mass Coating, we
            are dedicated to delivering the highest quality surface treatment and
            industrial coating services. Our state-of-the-art facilities and
            experienced team ensure that every project meets rigorous standards for
            durability, appearance, and performance. We use only premium materials
            and the latest techniques to provide coatings that protect and enhance
            your products for the long term.
          </p>
        </div> */}

      </main>
    </>
  );
}