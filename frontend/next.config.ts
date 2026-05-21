import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep file watching scoped to frontend app. Prevent scanning monorepo root.
    root: __dirname,
  },
};

export default nextConfig;

headers: async () => [{
  source: '/(.*)',
  headers: [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ]
}]