"use client";

import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Box, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const APP_HOME = "/app";
const EXIT_WINDOW_MS = 2000;

function isAppHome(pathname: string) {
  return pathname === APP_HOME || pathname === `${APP_HOME}/`;
}

export default function NativeAppBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [showExitHint, setShowExitHint] = useState(false);
  const pathnameRef = useRef(pathname);
  const waitingToExitRef = useRef(false);
  const hintTimeoutRef = useRef<number | null>(null);

  pathnameRef.current = pathname;

  useEffect(() => {
    if (!isAppHome(pathname)) {
      waitingToExitRef.current = false;
      setShowExitHint(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const listenerPromise = App.addListener("backButton", () => {
      const currentPath = pathnameRef.current;

      if (!isAppHome(currentPath)) {
        waitingToExitRef.current = false;
        setShowExitHint(false);
        if (hintTimeoutRef.current !== null) {
          window.clearTimeout(hintTimeoutRef.current);
          hintTimeoutRef.current = null;
        }
        router.replace(APP_HOME);
        return;
      }

      if (waitingToExitRef.current) {
        void App.exitApp();
        return;
      }

      waitingToExitRef.current = true;
      setShowExitHint(true);
      hintTimeoutRef.current = window.setTimeout(() => {
        waitingToExitRef.current = false;
        setShowExitHint(false);
        hintTimeoutRef.current = null;
      }, EXIT_WINDOW_MS);
    });

    return () => {
      void listenerPromise.then((handle) => handle.remove());
      if (hintTimeoutRef.current !== null) {
        window.clearTimeout(hintTimeoutRef.current);
      }
    };
  }, [router]);

  if (!showExitHint) {
    return null;
  }

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: "fixed",
        left: "50%",
        bottom: { xs: 20, sm: 28 },
        transform: "translateX(-50%)",
        zIndex: 15000,
        px: 2.5,
        py: 1.1,
        borderRadius: 6,
        bgcolor: "rgba(18, 4, 31, 0.88)",
        border: "1px solid",
        borderColor: "secondary.main",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        maxWidth: "90vw",
        pointerEvents: "none",
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontFamily: "Namecat, sans-serif",
          fontSize: { xs: 13, sm: 15 },
          letterSpacing: 1,
          whiteSpace: "nowrap",
        }}
      >
        To exit, tap one more time
      </Typography>
    </Box>
  );
}
