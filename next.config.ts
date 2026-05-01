import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloudinary.images-iherb.com",
        pathname: "/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
