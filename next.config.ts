import type { NextConfig } from "next";

// The site used to have one route per section (/about, /projects, …).
// Keep those links working by redirecting to the matching place on the home page.
const legacyRoutes: Record<string, string> = {
  about: "/",
  experience: "/#work",
  skills: "/#skills",
  projects: "/#projects",
  contact: "/#contact",
};

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(legacyRoutes).map(([from, to]) => ({
      source: `/${from}`,
      destination: to,
      permanent: true,
    }));
  },
};

export default nextConfig;
