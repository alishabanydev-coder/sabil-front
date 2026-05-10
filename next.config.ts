import type { NextConfig } from "next";

const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "localhost:5000";
const [imageHostname, imagePort] = imageDomain.split(":");

const nextConfig: NextConfig = {
  images: {
    // Needed in local development when upstream resolves to 127.0.0.1 / ::1.
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
