/**
 * Server (Next.js) may use INTERNAL_API_URL for API fetches (localhost).
 * Emulator WebView uses 10.0.2.2.
 * Physical phone on LAN uses the same host as the page (e.g. 192.168.x.x).
 *
 * Public asset URLs (images under /uploads) must never use INTERNAL_API_URL —
 * next/image and browsers need a publicly reachable host.
 */
function isLanHost(hostname) {
  return (
    hostname === "10.0.2.2" ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)
  );
}

function isLocalHostname(hostname) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    isLanHost(hostname)
  );
}

function publicBaseFromImageDomain(imageDomain) {
  if (imageDomain.startsWith("http://") || imageDomain.startsWith("https://")) {
    return new URL(imageDomain).origin;
  }

  const [hostname] = imageDomain.split(":");
  const protocol = isLocalHostname(hostname) ? "http" : "https";
  return `${protocol}://${imageDomain}`;
}

/** Base URL for API fetch calls (may be internal on the server). */
export function getApiBase() {
  if (typeof window === "undefined") {
    return (
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_ADMIN_API_URL ||
      "http://localhost:5000"
    );
  }

  const host = window.location.hostname;
  if (isLanHost(host)) {
    return `http://${host}:5000`;
  }

  return (
    process.env.NEXT_PUBLIC_ADMIN_API_URL ||
    "http://localhost:5000"
  );
}

/**
 * Base URL for /uploads and other browser-facing asset URLs.
 * Never uses INTERNAL_API_URL (avoids 127.0.0.1 in next/image).
 */
export function getPublicAssetBase() {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (isLanHost(host)) {
      return `http://${host}:5000`;
    }

    return (
      process.env.NEXT_PUBLIC_ADMIN_API_URL ||
      "http://localhost:5000"
    );
  }

  const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;
  if (imageDomain) {
    return publicBaseFromImageDomain(imageDomain);
  }

  return (
    process.env.NEXT_PUBLIC_ADMIN_API_URL ||
    "http://localhost:5000"
  );
}
