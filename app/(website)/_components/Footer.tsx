"use client";

import { getFooterSettings } from "@/services/footerSettings";
import { FooterData } from "@/types/footer";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      const data = await getFooterSettings();
      setFooterData(data);
    };

    fetchFooter();
  }, []);

  if (!footerData) return null;

  return (
    <footer className="mt-auto bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-bold">
              {footerData?.companyName || "Mass Coating Company"}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              {footerData?.description ||
                "Professional industrial coating and surface finishing services."}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
              <Link href="/gallery" className="hover:text-white">
                Gallery
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              Contact
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p className="flex gap-3">
                <EnvironmentOutlined className="mt-1 text-blue-300" />
                <span>{footerData?.address || "Company address here"}</span>
              </p>

              <p className="flex gap-3">
                <PhoneOutlined className="mt-1 text-blue-300" />
                <span>{footerData?.phone || "+91 9876543210"}</span>
              </p>

              <p className="flex gap-3">
                <MailOutlined className="mt-1 text-blue-300" />
                <span>{footerData?.email || "info@example.com"}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-center text-xl text-slate-400">
          {footerData?.copyright ||
            "© 2026 Mass Coating Company. All rights reserved."}
        </div>
        <span>Designed and Developed by <a href="https://heycmyportfolio.netlify.app/" className="text-blue-300 hover:text-blue-400">Aman Korabu</a></span>
      </div>
    </footer>
  );
}