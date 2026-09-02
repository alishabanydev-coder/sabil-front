"use client";

import { useLayoutEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Capacitor } from "@capacitor/core";

export type AppDisplayMode = "pending" | "native" | "mobile" | "desktop";

function mediaQueryFromBreakpoint(query: string) {
  return query.replace(/^@media\s*/i, "").trim();
}

export function useAppDisplayMode(): AppDisplayMode {
  const theme = useTheme();
  const [mode, setMode] = useState<AppDisplayMode>("pending");

  useLayoutEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setMode("native");
      return;
    }

    const media = window.matchMedia(
      mediaQueryFromBreakpoint(theme.breakpoints.down("sm"))
    );

    const apply = () => {
      setMode(media.matches ? "mobile" : "desktop");
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  return mode;
}
