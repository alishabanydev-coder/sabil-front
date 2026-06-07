"use client";

import { useEffect } from "react";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#fafafa",
          color: "#121212",
          textAlign: "center",
        }}
      >
        <main style={{ maxWidth: 520 }}>
          <p
            style={{
              margin: 0,
              fontSize: "clamp(3rem, 10vw, 5rem)",
              fontWeight: 800,
              lineHeight: 1,
              color: "#ff4c63",
            }}
          >
            Oops!
          </p>
          <h1 style={{ margin: "16px 0 8px", fontSize: "1.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ margin: "0 0 24px", color: "rgba(18, 18, 18, 0.72)" }}>
            A critical error occurred. Please try again or return to the home
            page.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: 999,
                padding: "10px 24px",
                fontWeight: 700,
                backgroundColor: "#dfff00",
                color: "#5c0c97",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 24px",
                borderRadius: 999,
                border: "2px solid #5c0c97",
                color: "#5c0c97",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Back to Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
