"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.scrollTo(0, {
      duration: 0.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
  }, [pathname, lenis]);

  return null;
}