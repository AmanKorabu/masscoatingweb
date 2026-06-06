import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://masscoatingweb.vercel.app";

  const routes = [
    {
      path: "",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      path: "/about",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/services",
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      path: "/gallery",
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      path: "/contact",
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      path: "/get-quote",
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ] as const;

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}