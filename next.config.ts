import type { NextConfig } from "next";

const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "localhost:5000";
const [imageHostname, imagePort] = imageDomain.split(":");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["100.127.255.253"],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: imageHostname || "localhost",
        port: imagePort || "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
