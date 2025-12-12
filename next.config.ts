import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Disable Vercel Toolbar
  experimental: {
    instrumentationHook: false,
  },
  // Disable Vercel Analytics and Speed Insights
  reactStrictMode: true,
};

export default nextConfig;
