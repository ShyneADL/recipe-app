/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.us-west-004.backblazeb2.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [80, 150, 180, 200, 256],
  },
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "@headlessui/react"],
  },
};

export default nextConfig;
