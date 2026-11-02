import type { MetadataRoute } from "next";
import { portfolioConfig } from "@/config/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = portfolioConfig.site.url;
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/lab`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
