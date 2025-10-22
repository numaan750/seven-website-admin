/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use a custom build folder (avoids OneDrive readlink errors)
  distDir: 'build',

  // Tell Next.js the real project root (fixes "multiple lockfiles" warning)
  outputFileTracingRoot: "C:\\Users\\Numaan ali\\OneDrive\\Desktop\\7app-admin",

  // Optional: disable symlinks to avoid readlink errors on OneDrive
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
