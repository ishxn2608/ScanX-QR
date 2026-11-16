/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ["firebasestorage.googleapis.com", "res.cloudinary.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};
module.exports = nextConfig;
