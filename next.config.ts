import type { NextConfig } from "next";

function buildImageRemotePattern() {
  const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "localhost:5000";

  if (imageDomain.startsWith("http://") || imageDomain.startsWith("https://")) {
    const url = new URL(imageDomain);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/uploads/**",
    };
  }

  const [hostname, port] = imageDomain.split(":");
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);

  return {
    protocol: isLocal ? ("http" as const) : ("https" as const),
    hostname: hostname || "localhost",
    ...(port ? { port } : isLocal ? { port: "5000" } : {}),
    pathname: "/uploads/**",
  };
}

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "10.221.183.149",
    "10.0.2.2",
    "192.168.2.224",
  ],
  images: {
    dangerouslyAllowLocalIP: true,
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [buildImageRemotePattern()],
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
