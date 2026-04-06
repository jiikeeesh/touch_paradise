import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['192.168.1.83'],
  serverExternalPackages: ["@prisma/client"],
};
export default nextConfig;
