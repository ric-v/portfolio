import type { MetadataRoute } from "next";
import { portfolioConfig } from "@/config/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: portfolioConfig.site.url, changeFrequency: "monthly", priority: 1 }];
}
