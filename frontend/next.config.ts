import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep file watching scoped to frontend app. Prevent scanning monorepo root.
    root: __dirname,
  },
};

export default nextConfig;
