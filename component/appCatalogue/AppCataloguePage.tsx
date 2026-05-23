"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  alpha,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

type LandscapeLock =
  | "any"
  | "natural"
  | "landscape"
  | "portrait"
  | "portrait-primary"
  | "portrait-secondary"
  | "landscape-primary"
  | "landscape-secondary";

type ProjectData = {
  _id: string;
  name: string;
  title: string;
  thumbnail: string;
  description: string;
};

type CatalogueData = {
  _id: string;
  projectId: string;
  header: string;
  body: string;
  image: string;
};

type VideoData = {
  _id: string;
  projectId: string;
  title: string;
  thumbnail: string;
  season?: number;
  episode?: number;
};

type AppCataloguePageProps = {
  projects: ProjectData[];
  catalogues: CatalogueData[];
  videos: VideoData[];
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isMobileOrTabletDevice() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent || "";
  const mobileOrTabletPattern =
    /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|PlayBook/i;
  const isTouchDevice = navigator.maxTouchPoints > 1;

  return mobileOrTabletPattern.test(userAgent) || isTouchDevice;
}

function isAndroidDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android/i.test(navigator.userAgent || "");
}

function detectStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const displayModeStandalone = window.matchMedia?.(
    "(display-mode: standalone)"
  )?.matches;
  const iosStandalone =
    typeof (window.navigator as Navigator & { standalone?: boolean })
      .standalone === "boolean" &&
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

  return Boolean(displayModeStandalone || iosStandalone);
}

async function requestAppFullscreen() {
  if (typeof document === "undefined") {
    return false;
  }

  if (document.fullscreenElement) {
    return true;
  }

  const fullscreenTarget = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
  };

  try {
    if (typeof fullscreenTarget.requestFullscreen === "function") {
      await fullscreenTarget.requestFullscreen();
      return true;
    }

    if (typeof fullscreenTarget.webkitRequestFullscreen === "function") {
      await fullscreenTarget.webkitRequestFullscreen();
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

async function tryLockLandscape() {
  if (typeof window === "undefined" || !("screen" in window)) {
    return false;
  }

  const orientationApi = window.screen.orientation as
    | (ScreenOrientation & {
        lock?: (orientation: LandscapeLock) => Promise<void>;
      })
    | undefined;
  if (typeof orientationApi?.lock !== "function") {
    return false;
  }

  try {
    await orientationApi.lock("landscape");
    return true;
  } catch {
    return false;
  }
}

export default function AppCataloguePage({
  projects,
  catalogues,
  videos,
}: AppCataloguePageProps) {
  const theme = useTheme();
  const [isHandheldDevice, setIsHandheldDevice] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [autoLockAttempted, setAutoLockAttempted] = useState(false);
  const [canInstallPwa, setCanInstallPwa] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [orientationMessage, setOrientationMessage] = useState(
    "Rotate to landscape for best experience."
  );

  useEffect(() => {
    setIsHandheldDevice(isMobileOrTabletDevice());
    setIsAndroid(isAndroidDevice());
    setIsStandalone(detectStandaloneMode());
    setIsFullscreenActive(Boolean(document.fullscreenElement));

    const onDisplayModeChange = () => {
      setIsStandalone(detectStandaloneMode());
    };

    window.matchMedia("(display-mode: standalone)")?.addEventListener?.(
      "change",
      onDisplayModeChange
    );

    return () => {
      window.matchMedia("(display-mode: standalone)")?.removeEventListener?.(
        "change",
        onDisplayModeChange
      );
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const syncFullscreenState = () => {
      setIsFullscreenActive(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", syncFullscreenState);
    document.addEventListener("webkitfullscreenchange", syncFullscreenState as EventListener);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
      document.removeEventListener(
        "webkitfullscreenchange",
        syncFullscreenState as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (!isHandheldDevice) {
      setCanInstallPwa(false);
      setDeferredInstallPrompt(null);
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event as BeforeInstallPromptEvent);
      setCanInstallPwa(true);
    };

    const handleAppInstalled = () => {
      setCanInstallPwa(false);
      setDeferredInstallPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isHandheldDevice]);

  useEffect(() => {
    const shouldAutoLock = isHandheldDevice && isAndroid;

    if (!shouldAutoLock) {
      return;
    }

    const run = async () => {
      const enteredFullscreen = await requestAppFullscreen();
      const success = await tryLockLandscape();
      setOrientationMessage(
        success
          ? "Landscape mode enabled."
          : enteredFullscreen
            ? "Could not lock orientation automatically. Tap LANDSCAPE or rotate manually."
            : "Automatic landscape needs a user gesture on this browser. Tap LANDSCAPE."
      );
      setAutoLockAttempted(true);
    };

    run();
  }, [isHandheldDevice, isAndroid]);

  const rails = useMemo(() => {
    return projects
      .map((project) => {
        const projectCatalogues = catalogues.filter(
          (item) => item.projectId === project._id
        );
        const projectVideos = videos.filter((item) => item.projectId === project._id);

        const catalogueCards = projectCatalogues.map((item) => ({
          id: `catalogue-${item._id}`,
          image: item.image,
          title: item.header || project.title,
          subtitle: item.body,
          badge: "Catalogue",
        }));

        const videoCards = projectVideos.map((item) => ({
          id: `video-${item._id}`,
          image: item.thumbnail,
          title: item.title,
          subtitle:
            Number.isFinite(item.season) && Number.isFinite(item.episode)
              ? `S${item.season} · E${item.episode}`
              : "Video",
          badge: "Video",
        }));

        return {
          projectId: project._id,
          projectTitle: project.title || project.name,
          cards: [...catalogueCards, ...videoCards],
        };
      })
      .filter((rail) => rail.cards.length > 0);
  }, [projects, catalogues, videos]);

  const handleManualLandscape = async () => {
    if (!isHandheldDevice) {
      return;
    }

    await requestAppFullscreen();
    const success = await tryLockLandscape();
    setOrientationMessage(
      success
        ? "Landscape mode enabled."
        : "Fullscreen/orientation lock is restricted by this browser. Please rotate manually."
    );
    setAutoLockAttempted(true);
  };

  const handleInstallApp = async () => {
    if (!deferredInstallPrompt) {
      setOrientationMessage(
        "Install prompt is not available in this browser right now."
      );
      setAutoLockAttempted(true);
      return;
    }

    await deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    setDeferredInstallPrompt(null);
    setCanInstallPwa(false);
  };

  return (
    <Stack
      sx={{
        minHeight: "100dvh",
        width: "100%",
        bgcolor: "#12041f",
        background:
          "radial-gradient(circle at 12% 0%, rgba(88,32,143,0.45), transparent 38%), radial-gradient(circle at 88% 4%, rgba(32,111,177,0.34), transparent 32%), #12041f",
        color: "#fff",
        pb: 4,
      }}
    >
      <Stack
        direction="row"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: { xs: 1.5, md: 3 },
          py: 1,
          backdropFilter: "blur(8px)",
          bgcolor: alpha(theme.palette.common.black, 0.35),
          borderBottom: (palette) =>
            `1px solid ${alpha(palette.palette.common.white, 0.12)}`,
        }}
      >
        <Typography sx={{ fontFamily: "Namecat", letterSpacing: 1.4, fontSize: 18 }}>
          SABIL KIDS APP
        </Typography>
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button
            component={Link}
            href="/"
            variant="contained"
            color="secondary"
            size="small"
            sx={{ fontFamily: "Namecat", letterSpacing: 1.2 }}
          >
            HOME
          </Button>
          {isHandheldDevice && canInstallPwa && !isStandalone && (
            <Button
              onClick={handleInstallApp}
              variant="contained"
              color="warning"
              size="small"
              sx={{ fontFamily: "Namecat", letterSpacing: 1.2 }}
            >
              INSTALL
            </Button>
          )}
          {isHandheldDevice && !isFullscreenActive && (
            <Button
              onClick={handleManualLandscape}
              variant="outlined"
              color="inherit"
              size="small"
              sx={{ fontFamily: "Namecat", letterSpacing: 1.2 }}
            >
              LANDSCAPE
            </Button>
          )}
        </Stack>
      </Stack>

      <Stack sx={{ px: { xs: 1.5, md: 3 }, pt: 2, gap: 2 }}>
        <Stack sx={{ gap: 0.6 }}>
          <Typography
            sx={{
              fontFamily: "Bhel Puri",
              fontSize: { xs: 26, md: 40 },
              lineHeight: 1,
              color: "primary.light",
              textTransform: "uppercase",
            }}
          >
            Catalogue
          </Typography>
          <Typography
            sx={{
              fontFamily: "Namecat",
              fontSize: { xs: 11, md: 14 },
              letterSpacing: 1.1,
              textTransform: "uppercase",
              opacity: 0.86,
            }}
          >
            App-style horizontal rows inspired by kids streaming apps
          </Typography>
          {isHandheldDevice && autoLockAttempted && (
            <Chip
              label={orientationMessage}
              color="primary"
              size="small"
              sx={{ width: "fit-content", mt: 1 }}
            />
          )}
        </Stack>

        {rails.length === 0 ? (
          <Typography sx={{ opacity: 0.75 }}>
            No catalogue data available yet.
          </Typography>
        ) : (
          rails.map((rail) => (
            <Stack key={rail.projectId} sx={{ gap: 1.2 }}>
              <Typography
                sx={{
                  fontFamily: "Namecat",
                  textTransform: "uppercase",
                  fontSize: { xs: 14, md: 18 },
                  letterSpacing: 1.1,
                  color: "warning.light",
                }}
              >
                {rail.projectTitle}
              </Typography>
              <Stack
                direction="row"
                sx={{
                  overflowX: "auto",
                  gap: 1.2,
                  pb: 1,
                  scrollSnapType: "x mandatory",
                  "&::-webkit-scrollbar": { height: 8 },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: 99,
                  },
                }}
              >
                {rail.cards.map((card) => (
                  <Stack
                    key={card.id}
                    sx={{
                      minWidth: { xs: 180, sm: 240, md: 280 },
                      maxWidth: { xs: 180, sm: 240, md: 280 },
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: alpha(theme.palette.common.white, 0.08),
                      border: "1px solid rgba(255,255,255,0.15)",
                      scrollSnapAlign: "start",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16 / 9",
                        bgcolor: "#1f1433",
                      }}
                    >
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <Stack sx={{ px: 1.2, py: 1, gap: 0.5 }}>
                      <Typography
                        sx={{
                          fontFamily: "Namecat",
                          fontSize: { xs: 11, md: 13 },
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: 11, md: 12 },
                          color: "rgba(255,255,255,0.72)",
                          minHeight: 18,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {card.subtitle}
                      </Typography>
                      <Chip
                        label={card.badge}
                        color="secondary"
                        size="small"
                        sx={{ width: "fit-content", height: 22 }}
                      />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          ))
        )}
      </Stack>

    </Stack>
  );
}
