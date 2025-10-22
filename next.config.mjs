/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional: disable symlinks to avoid readlink errors on OneDrive
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },

  // Add this for Next.js 13+ App Router support
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
