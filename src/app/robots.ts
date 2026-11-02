import type { MetadataRoute } from "next";
import { portfolioConfig } from "@/config/portfolio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${portfolioConfig.site.url}/sitemap.xml`,
  };
}
