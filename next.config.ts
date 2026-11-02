import type { NextConfig } from "next";

// The site used to have one route per section (/about, /projects, …).
// Keep those links working by redirecting to the matching anchor.
const legacySections = ["about", "experience", "skills", "projects", "contact"];

const nextConfig: NextConfig = {
  async redirects() {
    return legacySections.map((id) => ({
      source: `/${id}`,
      destination: `/#${id}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
