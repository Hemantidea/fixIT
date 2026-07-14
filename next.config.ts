import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js Turbopack from bundling Prisma engine files
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;