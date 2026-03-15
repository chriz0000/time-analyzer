import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/confirmed%20",
        destination: "/confirmed",
      },
    ];
  },
};

export default nextConfig;
