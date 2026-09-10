"use client";

import WatchPlayerPlayIcon from "@/component/appCatalogue/watch/WatchPlayerPlayIcon";
import WatchPlyrFullscreenHud from "@/component/appCatalogue/watch/WatchPlyrFullscreenHud";
import { suppressWatchNavbarBack } from "@/component/appCatalogue/watch/suppressWatchNavbarBack";
import { Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const HUD_HIDE_MS = 5000;

type PlyrPlayer = import("plyr");

const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;

/** Full Plyr bar for desktop web. */
export const PLYR_DESKTOP_CONTROLS = [
  "play-large",
  "rewind",
  "play",
  "fast-forward",
  "progress",
  "current-time",
  "duration",
  "mute",
  "volume",
  "captions",
  "settings",
  "pip",
  "airplay",
  "fullscreen",
] as const;

/** Compact bar for the Capacitor app. Volume is system-level on phones. */
export const PLYR_NATIVE_CONTROLS = [
  "play",
  "progress",
  "current-time",
  "mute",
  "captions",
  "settings",
  "fullscreen",
] as const;

export function getYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery && YOUTUBE_ID_PATTERN.test(fromQuery)) {
        return fromQuery;
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      const nestedId =
        parts[0] === "embed" ||
        parts[0] === "shorts" ||
        parts[0] === "live" ||
        parts[0] === "v"
          ? parts[1]
          : null;

      return nestedId && YOUTUBE_ID_PATTERN.test(nestedId) ? nestedId : null;
    }
  } catch {
    return null;
  }

  return null;
}

type WatchPlyrPlayerProps = {
  url: string;
  thumbnail?: string;
  title?: string;
  isNative: boolean;
  onStartedChange?: (started: boolean) => void;
};

const WatchPlyrPlayer = ({
  url,
  thumbnail,
  title,
  isNative,
  onStartedChange,
}: WatchPlyrPlayerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<PlyrPlayer | null>(null);
  const pendingStartRef = useRef(false);
  const startedRef = useRef(false);
  const onStartedChangeRef = useRef(onStartedChange);
  const isPlayingRef = useRef(false);
  const isPlaybackActiveRef = useRef(false);
  const hudHideTimeoutRef = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [plyrRoot, setPlyrRoot] = useState<HTMLElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hudVisible, setHudVisible] = useState(false);
  const youtubeId = getYouTubeVideoId(url);

  onStartedChangeRef.current = onStartedChange;

  const clearHudHide = useCallback(() => {
    if (hudHideTimeoutRef.current !== null) {
      window.clearTimeout(hudHideTimeoutRef.current);
      hudHideTimeoutRef.current = null;
    }
  }, []);

  const scheduleHudHide = useCallback(() => {
    clearHudHide();

    if (!isPlaybackActiveRef.current) {
      return;
    }

    hudHideTimeoutRef.current = window.setTimeout(() => {
      setHudVisible(false);
      playerRef.current?.toggleControls(false);
      hudHideTimeoutRef.current = null;
    }, HUD_HIDE_MS);
  }, [clearHudHide]);

  const revealHud = useCallback(() => {
    setHudVisible(true);
    playerRef.current?.toggleControls(true);
    scheduleHudHide();
  }, [scheduleHudHide]);

  const revealHudRef = useRef(revealHud);
  revealHudRef.current = revealHud;
  const scheduleHudHideRef = useRef(scheduleHudHide);
  scheduleHudHideRef.current = scheduleHudHide;

  const concealHud = useCallback(() => {
    if (!isPlayingRef.current) {
      return;
    }

    clearHudHide();
    setHudVisible(false);
    playerRef.current?.toggleControls(false);
  }, [clearHudHide]);

  const handleHudSurfaceTap = useCallback(() => {
    if (hudVisible) {
      concealHud();
      return;
    }

    revealHud();
  }, [hudVisible, concealHud, revealHud]);

  const handleTogglePlayback = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    if (player.paused) {
      void player.play();
      return;
    }

    player.pause();
  }, []);

  const handleExitFullscreen = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    suppressWatchNavbarBack(1000);
    player.pause();
    player.fullscreen.exit();
  }, []);

  const markStarted = useCallback(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    setStarted(true);
  }, []);

  const beginPlayback = useCallback(() => {
    const player = playerRef.current;
    pendingStartRef.current = true;
    markStarted();

    if (!player) {
      return;
    }

    void player.play();
    if (isNative && !player.fullscreen.active) {
      player.fullscreen.enter();
    }
  }, [isNative, markStarted]);

  useEffect(() => {
    startedRef.current = false;
    pendingStartRef.current = false;
    isPlayingRef.current = false;
    isPlaybackActiveRef.current = false;
    clearHudHide();
    setStarted(false);
    setIsFullscreen(false);
    setIsPlaying(false);
    setHudVisible(false);
    setPlyrRoot(null);
  }, [url, clearHudHide]);

  useEffect(() => {
    onStartedChangeRef.current?.(started);
  }, [started]);

  useEffect(() => {
    return () => {
      clearHudHide();
    };
  }, [clearHudHide]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !youtubeId) {
      return;
    }

    const target = document.createElement("div");
    target.setAttribute("data-plyr-provider", "youtube");
    target.setAttribute("data-plyr-embed-id", youtubeId);
    container.appendChild(target);

    let cancelled = false;
    let player: PlyrPlayer | null = null;

    const setup = async () => {
      const PlyrModule = await import("plyr");
      const PlyrCtor = (
        PlyrModule as unknown as {
          default: new (target: HTMLElement, options?: object) => PlyrPlayer;
        }
      ).default;
      if (cancelled) {
        return;
      }

      player = new PlyrCtor(target, {
        autoplay: false,
        autopause: true,
        clickToPlay: !isNative,
        hideControls: !isNative,
        ratio: "16:9",
        controls: [
          ...(isNative ? PLYR_NATIVE_CONTROLS : PLYR_DESKTOP_CONTROLS),
        ],
        settings: ["captions", "quality", "speed"],
        tooltips: { controls: true, seek: true },
        fullscreen: {
          enabled: true,
          fallback: isNative ? "force" : true,
          iosNative: false,
        },
        youtube: {
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          controls: 0,
          customControls: true,
        },
      });

      const tryStartFromGesture = () => {
        if (!pendingStartRef.current || !player) {
          return;
        }

        void player.play();
        if (isNative && !player.fullscreen.active) {
          player.fullscreen.enter();
        }
      };

      player.on("ready", () => {
        if (cancelled) {
          return;
        }
        setPlyrRoot(player?.elements.container ?? null);
        tryStartFromGesture();
      });
      player.on("enterfullscreen", () => {
        setIsFullscreen(true);
        revealHudRef.current();
      });
      player.on("exitfullscreen", () => {
        setHudVisible(false);
        clearHudHide();
        window.setTimeout(() => {
          setIsFullscreen(false);
        }, 350);
      });
      player.on("play", () => {
        isPlayingRef.current = true;
        setIsPlaying(true);
        markStarted();
        if (isNative && player && !player.fullscreen.active) {
          player.fullscreen.enter();
        } else if (isNative && player?.fullscreen.active) {
          revealHudRef.current();
        }
      });
      player.on("playing", () => {
        isPlaybackActiveRef.current = true;
        isPlayingRef.current = true;
        setIsPlaying(true);
        if (isNative && player?.fullscreen.active) {
          scheduleHudHideRef.current();
        }
      });
      player.on("waiting", () => {
        isPlaybackActiveRef.current = false;
        clearHudHide();
      });
      player.on("pause", () => {
        isPlayingRef.current = false;
        isPlaybackActiveRef.current = false;
        setIsPlaying(false);
        if (player?.fullscreen.active) {
          revealHudRef.current();
        }
      });
      player.on("ended", () => {
        isPlayingRef.current = false;
        isPlaybackActiveRef.current = false;
        setIsPlaying(false);
        if (isNative && player?.fullscreen.active) {
          player.fullscreen.exit();
        }
      });
      player.on("controlsshown", () => {
        if (!isNative || !player?.fullscreen.active) {
          return;
        }

        setHudVisible(true);
      });

      playerRef.current = player;
      tryStartFromGesture();
    };

    void setup();

    return () => {
      cancelled = true;
      playerRef.current = null;
      setPlyrRoot(null);
      setIsFullscreen(false);
      setHudVisible(false);
      player?.destroy();
      container.innerHTML = "";
    };
  }, [youtubeId, isNative, markStarted, clearHudHide]);

  if (!youtubeId) {
    return (
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "black",
          px: 2,
        }}
      >
        <Typography sx={{ color: "white", textAlign: "center" }}>
          This video URL is not a supported YouTube link.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      className={
        isNative
          ? "watch-plyr watch-plyr--native"
          : "watch-plyr watch-plyr--desktop"
      }
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        bgcolor: "#000",
      }}
    >
      <Stack
        ref={containerRef}
        sx={{
          width: "100%",
          height: "100%",
          "& .plyr, & .plyr__video-wrapper, & .plyr__video-embed": {
            width: "100%",
            height: "100%",
            paddingBottom: "0 !important",
          },
          "& .plyr__controls, & .plyr__menu": {
            zIndex: 6,
          },
          "& .plyr__control--overlaid": {
            display: "none !important",
          },
        }}
      />

      {!started ? (
        <Stack
          className="watch-player-preview"
          component="button"
          type="button"
          onClick={beginPlayback}
          aria-label={`Play ${title || "video"}`}
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            border: 0,
            p: 0,
            m: 0,
            cursor: "pointer",
            bgcolor: "transparent",
            overflow: "hidden",
            width: "100%",
            height: "100%",
            appearance: "none",
            WebkitAppearance: "none",
            font: "inherit",
            color: "inherit",
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          }}
        >
          {thumbnail ? <img src={thumbnail} alt={title || "Video"} /> : null}
          <WatchPlayerPlayIcon />
        </Stack>
      ) : null}

      {isNative && isFullscreen && plyrRoot
        ? createPortal(
            <WatchPlyrFullscreenHud
              visible={hudVisible}
              isPlaying={isPlaying}
              onSurfaceTap={handleHudSurfaceTap}
              onTogglePlayback={handleTogglePlayback}
              onExitFullscreen={handleExitFullscreen}
            />,
            plyrRoot
          )
        : null}
    </Stack>
  );
};

export default WatchPlyrPlayer;
