import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.83'],

  // Force Next.js file tracer to include pg-cloudflare dist files.
  // pg detects process.versions['workerd'] and unconditionally requires
  // pg-cloudflare in Cloudflare Workers — without this, the traced bundle
  // copies package.json but omits dist/index.js, crashing at startup.
  outputFileTracingIncludes: {
    '/**': ['./node_modules/pg-cloudflare/dist/**'],
  },

  // Treat pg and prisma as external so Next.js handles their file tracing
  // instead of bundling them (avoids symlink/native module issues on Workers).
  serverExternalPackages: ['pg', 'pg-cloudflare', '@prisma/client', '@prisma/adapter-pg'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**',
      },
      {
        // R2 public dev subdomain (pub-*.r2.dev)
        protocol: 'https',
        hostname: '*.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
export default nextConfig;

