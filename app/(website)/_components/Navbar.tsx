"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX, HiSparkles } from "react-icons/hi";
import { useState, useEffect } from "react";
import { getNavbarSettings } from "@/services/navbarSettings";
import { NavbarData } from "@/types/navbar";
const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  const [navbarData, setNavbarData] = useState<NavbarData | null>(null);


  useEffect(() => {
    const fetchNavbarData = async () => {
      const data = await getNavbarSettings()
      console.log(data)
      setNavbarData(data)
    }
    fetchNavbarData()
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, []);
  const hideNavbar = pathname.startsWith("/admin")
  if (hideNavbar) return null;

  return (
    <>
      <header className="fixed top-0 w-full z-50 ">
        <div
          className={`max-w-7xl mx-auto transition-all duration-500 ${scrolled
            ? "bg-[#0a1a2f]/80 backdrop-blur-xl border border-white/20 shadow-2xl"
            : "bg-gradient-to-r from-[#0a1a2f]/90 to-[#0d2847]/90 backdrop-blur-md border border-white/10"
            } `}
        >
          <nav className="lg:px-8 h-[85px] flex items-center justify-between">

            {/* Premium Logo */}
            <Link href="/" className="group relative">
              <div className="flex items-center md:gap-3">

                <div className="flex items-center">
                  {navbarData?.logoUrl ? (
                    <img
                      src={navbarData.logoUrl}
                      alt={navbarData?.companyName || "logo"}
                      className="h-25 w-auto object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <HiSparkles className="text-white text-xl" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="sm:text-3xl text-white font-bold text-xl tracking-tight leading-tight">
                    {navbarData?.companyName || "MASS COATING"}
                  </div>
                  <div className="text-xs text-blue-300 tracking-wider">
                    INDUSTRIAL SOLUTIONS
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-5 py-2 rounded-xl font-medium transition-all duration-300 ${pathname === link.path
                    ? "text-white bg-white/10 border border-white/20 shadow-lg"
                    : "text-blue-100 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/get-quote"
                className="ml-4 px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
              >
                {navbarData?.ctaText || "Get a Quote"}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 rounded-xl m-1  text-white flex items-center justify-center hover:bg-white/20 transition-all"
            >
              {isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden border-t border-white/10 p-6">
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${pathname === link.path
                      ? "text-white bg-white/10"
                      : "text-blue-100 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href={`${navbarData?.ctaLink || "/contact"}`}
                  onClick={() => setIsOpen(false)}
                  className="mt-2 px-4 py-3 rounded-xl font-semibold text-center text-white bg-gradient-to-r from-blue-500 to-cyan-500"
                >
                  {navbarData?.ctaText || "Start Project"}
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="h-20"></div>
    </>
  );
}