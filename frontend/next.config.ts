import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ── clickjacking ───────────────────────────────────────────────
          { key: "X-Frame-Options", value: "DENY" },

          // ── MIME sniffing ──────────────────────────────────────────────
          { key: "X-Content-Type-Options", value: "nosniff" },

          // ── referrer ───────────────────────────────────────────────────
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // ── permissions ────────────────────────────────────────────────
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },

          // ── HSTS (only in prod) ────────────────────────────────────────
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]),

          // ── CSP ────────────────────────────────────────────────────────
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              isDev
                ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
                : "script-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              // dev: allow localhost backend; prod: allow your real domain
              isDev
                ? "connect-src 'self' http://localhost:8000"
                : "connect-src 'self' https://api.codewithishant.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;