"use client";

import { getAboutSettings } from "@/services/aboutSettings";
import { AboutData } from "@/types/aboutData";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import WhoWeAreSection from "./WhoWeAreSection";
import { usePathname } from "next/navigation";
export default function AboutPreviewSection() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const data = await getAboutSettings();
        setAboutData(data);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-slate-50 px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Image skeleton */}
          <div className="h-[280px] animate-pulse rounded-[2rem] bg-slate-200 sm:h-[380px] lg:h-[460px]" />

          {/* Content skeleton */}
          <div>
            <div className="h-8 w-44 animate-pulse rounded-full bg-slate-200" />

            <div className="mt-5 h-12 max-w-xl animate-pulse rounded-xl bg-slate-200" />

            <div className="mt-4 h-5 max-w-2xl animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-3 h-5 max-w-xl animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded-xl bg-slate-200"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Full description skeleton */}
        <div className="mx-auto mt-10 max-w-7xl rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7 md:mt-14 md:p-8">
          <div className="h-6 w-72 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-11/12 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-10/12 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return null;
  }

  const highlights = aboutData.highlights || [];
  return (
    <>
      <section className="relative overflow-hidden bg-slate-50 px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-10 h-72 w-72 rounded-full bg-blue-100 blur-[100px]" />
          <div className="absolute bottom-[-140px] right-[-120px] h-80 w-80 rounded-full bg-cyan-100 blur-[110px]" />

          <div className="absolute inset-0 opacity-[0.35] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:70px_70px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Main Row */}
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Image */}
            {aboutData.imageUrl && (
              <div className="relative">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-500 to-cyan-400 opacity-20 blur-2xl" />

                <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl ring-1 ring-slate-200">
                  <img
                    src={aboutData.imageUrl}
                    alt={aboutData.title}
                    className="h-[280px] w-full rounded-[1.5rem] object-cover sm:h-[380px] lg:h-[460px]"
                  />

                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-slate-950/75 p-4 text-white backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                        <ToolOutlined />
                      </div>

                      <div>
                        <p className="text-sm font-bold">
                          Industrial Surface Solutions
                        </p>
                        <p className="text-xs text-slate-300">
                          Coating • Painting • Finishing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            <div>
              <div className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 sm:text-xs">
                  {aboutData.badge || "About Our Company"}
                </span>
              </div>

              <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                {aboutData.title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base md:text-lg">
                {aboutData.shortDescription}
              </p>

              {highlights.length > 0 && (
                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {highlights.slice(0, 10).map((item: string, index: number) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    >
                      <CheckCircleOutlined className="text-blue-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full Description */}
          {aboutData.fullDescription && (
            <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl sm:p-7 md:mt-14 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
                  <InfoCircleOutlined className="text-xl" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-950 sm:text-2xl">
                    More About Mass Coating Company
                  </h3>

                  <p className="mt-3 whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
                    {aboutData.fullDescription}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {pathname === "/about" && <WhoWeAreSection />}
    </>
  );
}