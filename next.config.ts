import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix workspace root inference warning by pinning Turbopack root
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
