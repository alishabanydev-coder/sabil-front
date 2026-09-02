"use client";

import { Stack } from "@mui/material";
import WatchNabar from "@/component/appCatalogue/watch/WatchNabar";
import { useAppDisplayMode } from "@/lib/useAppDisplayMode";

const APP_GRADIENT =
  "linear-gradient(to top, #8acbfa 0%, #8acbfa 10%, transparent 100%)";

const WatchLayout = ({ children }: { children: React.ReactNode }) => {
  const displayMode = useAppDisplayMode();
  const usePhoto =
    displayMode === "native" || displayMode === "desktop";
  const useGradient = displayMode === "mobile";

  return (
    <Stack
      sx={{
        height: "100%",
        minHeight: "100dvh",
        position: "relative",
        direction: "ltr",
        bgcolor: displayMode === "pending" ? "#12041f" : "transparent",
        backgroundImage: useGradient
          ? APP_GRADIENT
          : usePhoto
            ? "url(/application-background.png)"
            : "none",
        backgroundSize: "contain",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <WatchNabar />
      {children}
    </Stack>
  );
};

export default WatchLayout;
