/**
 * Server (Next.js on your PC) uses localhost.
 * Emulator WebView uses 10.0.2.2.
 * Physical phone on LAN uses the same host as the page (e.g. 192.168.x.x).
 */
function isLanHost(hostname) {
  return (
    hostname === "10.0.2.2" ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)
  );
}

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
