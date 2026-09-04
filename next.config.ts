import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
    // Disable optimization for TMDB images (they're already optimized CDN images)
    unoptimized: false,
  },
  // Allow server-side env vars
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY || "",
  },
};

export default nextConfig;
