"use client";

import { getPartners } from "@/services/partnerSettings";
import { PartnerData, PartnersSectionData } from "@/types/partner";
import {
  EnvironmentOutlined,
  LeftOutlined,
  ReadOutlined,
  RightOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";

export default function WhoWeAreSection() {
  const [data, setData] = useState<PartnersSectionData | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const result = await getPartners();
        setData(result);

      } catch (error) {
        console.error("Error fetching partners:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const partners: PartnerData[] =
    data?.members
      ?.filter((item) => item.isActive)
      ?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };
  if (loading) {
    return (
      <section className="relative overflow-hidden bg-[#07111f] px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mx-auto h-8 w-44 animate-pulse rounded-full bg-white/15" />
            <div className="mx-auto mt-5 h-10 max-w-md animate-pulse rounded-xl bg-white/15" />
            <div className="mx-auto mt-4 h-5 max-w-xl animate-pulse rounded-lg bg-white/10" />
          </div>

          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[520px] w-[292px] shrink-0 animate-pulse rounded-[1.75rem] bg-white/10 sm:w-[340px] lg:w-[360px]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (partners.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#07111f] px-4 py-14 sm:px-6 md:py-20 lg:px-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-140px] top-10 h-80 w-80 rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-[-140px] right-[-120px] h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100 sm:text-xs">
                {data?.badge || "Who We Are"}
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              {data?.title || "Our Partners"}
            </h2>

            {data?.subTitle && (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {data.subTitle}
              </p>
            )}
          </div>

          {partners.length > 1 && (
            <div className="hidden gap-3 sm:flex">
              <Button
                shape="circle"
                size="large"
                icon={<LeftOutlined />}
                onClick={() => scrollSlider("left")}
                className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
              />

              <Button
                shape="circle"
                size="large"
                icon={<RightOutlined />}
                onClick={() => scrollSlider("right")}
                className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
              />
            </div>
          )}
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className={`flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-5 custom-partner-slider ${partners.length <= 2 ? "lg:justify-center" : "justify-start"
            }`}
        >
          {partners.map((partner, index) => (
            <article
              key={`${partner.name}-${index}`}
              className="group w-[292px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.08] shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.12] sm:w-[340px] lg:w-[360px]"
            >
              {/* Image */}
              <div className="relative h-[340px] overflow-hidden bg-slate-900 sm:h-[380px]">
                {partner.imageUrl ? (
                  <img
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800">
                    <UserOutlined className="text-6xl text-slate-500" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

                <div className="absolute left-5 right-5 top-5 flex justify-end">
                  <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
                    Member
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-2xl font-black leading-tight text-white">
                    {partner.name}
                  </h3>

                  <p className="mt-2 inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-100 backdrop-blur">
                    {partner.position}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 sm:p-6">
                <div className="space-y-3">
                  {partner.education && (
                    <div className="flex gap-3 text-sm text-slate-300">
                      <ReadOutlined className="mt-1 shrink-0 text-cyan-300" />
                      <span>{partner.education}</span>
                    </div>
                  )}

                  {partner.location && (
                    <div className="flex gap-3 text-sm text-slate-300">
                      <EnvironmentOutlined className="mt-1 shrink-0 text-cyan-300" />
                      <span>{partner.location}</span>
                    </div>
                  )}
                </div>

                {partner.bio && (
                  <p className="mt-5 line-clamp-4 text-sm leading-7 text-slate-300">
                    {partner.bio}
                  </p>
                )}

                <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                  <TeamOutlined />
                  <span>Leadership Team</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {partners.length > 1 && (
          <p className="mt-2 text-center text-xs text-slate-400 sm:hidden">
            Swipe to view more members
          </p>
        )}
      </div>
    </section>
  );
}