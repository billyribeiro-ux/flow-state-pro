import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* React strict mode for catching issues early */
  reactStrictMode: true,

  /* Enable PPR (Partial Prerendering) when stable */
  experimental: {
    // ppr: true,
    // reactCompiler: true,
    optimizePackageImports: [
      "@phosphor-icons/react",
      "date-fns",
      "d3",
      "lodash-es",
    ],
  },

  /* Image optimization */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ],
  },

  /* Headers for security */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },

  /* Redirect www to non-www */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.flowstatepro.com" }],
        destination: "https://flowstatepro.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "flowstate-pro",
  project: "flowstate-web",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
