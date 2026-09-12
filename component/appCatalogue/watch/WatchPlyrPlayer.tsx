"use client";

import WatchPlayerPlayIcon from "@/component/appCatalogue/watch/WatchPlayerPlayIcon";
import WatchPlyrFullscreenHud from "@/component/appCatalogue/watch/WatchPlyrFullscreenHud";
import { suppressWatchNavbarBack } from "@/component/appCatalogue/watch/suppressWatchNavbarBack";
import { Stack, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const HUD_HIDE_MS = 5000;
const DESKTOP_HUD_HIDE_MS = 4000;
const DESKTOP_FULLSCREEN_HUD_HIDE_MS = 4000;
export const FULLSCREEN_ANIM_MS = 380;

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

function injectPlyrVolumeSetting(player: PlyrPlayer) {
  const home = player.elements.container.querySelector('[id$="-home"]');
  const menu = home?.querySelector('[role="menu"]');
  if (!menu || menu.querySelector(".watch-plyr-volume-setting")) {
    return;
  }

  const row = document.createElement("div");
  row.className = "watch-plyr-volume-setting";
  row.setAttribute("role", "menuitem");

  const label = document.createElement("span");
  label.className = "watch-plyr-volume-setting__label";
  label.textContent = "Volume";

  const input = document.createElement("input");
  input.type = "range";
  input.min = "0";
  input.max = "1";
  input.step = "0.05";
  input.value = String(player.muted ? 0 : player.volume);
  input.setAttribute("aria-label", "Volume");

  const syncInput = () => {
    input.value = String(player.muted ? 0 : player.volume);
  };

  input.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });
  input.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  input.addEventListener("input", () => {
    const nextVolume = Number(input.value);
    player.volume = nextVolume;
    player.muted = nextVolume === 0;
  });
  player.on("volumechange", syncInput);

  row.append(label, input);
  menu.appendChild(row);
}

type WatchPlyrPlayerProps = {
  url: string;
  thumbnail?: string;
  title?: string;
  isNative: boolean;
  onStartedChange?: (started: boolean) => void;
  onNativeBelowShift?: (shiftY: number) => void;
};

const WatchPlyrPlayer = ({
  url,
  thumbnail,
  title,
  isNative,
  onStartedChange,
  onNativeBelowShift,
}: WatchPlyrPlayerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<PlyrPlayer | null>(null);
  const fsPhaseRef = useRef<"idle" | "entering" | "fullscreen" | "exiting">(
    "idle"
  );
  const isFullscreenRef = useRef(false);
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
  const theme = useTheme();
  const youtubeId = getYouTubeVideoId(url);

  const onNativeBelowShiftRef = useRef(onNativeBelowShift);
  onStartedChangeRef.current = onStartedChange;
  onNativeBelowShiftRef.current = onNativeBelowShift;

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

    hudHideTimeoutRef.current = window.setTimeout(
      () => {
        hudHideTimeoutRef.current = null;
        if (!isPlayingRef.current || !isPlaybackActiveRef.current) {
          return;
        }

        setHudVisible(false);
        playerRef.current?.toggleControls(false);
      },
      isNative
        ? HUD_HIDE_MS
        : isFullscreenRef.current
        ? DESKTOP_FULLSCREEN_HUD_HIDE_MS
        : DESKTOP_HUD_HIDE_MS
    );
  }, [clearHudHide, isNative]);

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

  const handleInlineSurfaceTap = useCallback(() => {
    setHudVisible((visible) => !visible);
  }, []);

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

  const clearShellInlineStyles = useCallback(() => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    shell.classList.remove("watch-plyr-shell--lifted");
    shell.style.top = "";
    shell.style.left = "";
    shell.style.width = "";
    shell.style.height = "";
    shell.style.borderRadius = "";
    shell.style.transition = "";
    shell.style.position = "";
    shell.style.zIndex = "";
  }, []);

  const enterAppFullscreen = useCallback(() => {
    if (!isNative) {
      return;
    }

    const shell = shellRef.current;
    const slot = slotRef.current;
    if (!shell || !slot || fsPhaseRef.current !== "idle") {
      return;
    }

    fsPhaseRef.current = "entering";
    const rect = slot.getBoundingClientRect();
    onNativeBelowShiftRef.current?.(
      Math.max(0, window.innerHeight - rect.bottom)
    );
    shell.classList.add("watch-plyr-shell--lifted");
    shell.style.transition = "none";
    shell.style.top = `${rect.top}px`;
    shell.style.left = `${rect.left}px`;
    shell.style.width = `${rect.width}px`;
    shell.style.height = `${rect.height}px`;
    shell.style.borderRadius = "16px";

    let finished = false;
    const finishEnter = () => {
      if (finished || fsPhaseRef.current !== "entering") {
        return;
      }

      finished = true;
      fsPhaseRef.current = "fullscreen";
      isFullscreenRef.current = true;
      setIsFullscreen(true);
      revealHudRef.current();
    };

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "width") {
        return;
      }

      shell.removeEventListener("transitionend", onEnd);
      finishEnter();
    };

    shell.addEventListener("transitionend", onEnd);
    window.setTimeout(finishEnter, FULLSCREEN_ANIM_MS + 80);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const ease = `${FULLSCREEN_ANIM_MS}ms ease-out`;
        shell.style.transition = `top ${ease}, left ${ease}, width ${ease}, height ${ease}, border-radius ${ease}`;
        shell.style.top = "0px";
        shell.style.left = "0px";
        shell.style.width = "100vw";
        shell.style.height = "100dvh";
        shell.style.borderRadius = "0px";
      });
    });
  }, [isNative]);

  const exitAppFullscreen = useCallback(() => {
    if (!isNative) {
      return;
    }

    const shell = shellRef.current;
    const slot = slotRef.current;
    if (!shell || !slot) {
      return;
    }

    if (
      fsPhaseRef.current !== "fullscreen" &&
      fsPhaseRef.current !== "entering"
    ) {
      return;
    }

    fsPhaseRef.current = "exiting";
    isFullscreenRef.current = false;
    setHudVisible(false);
    clearHudHide();
    onNativeBelowShiftRef.current?.(0);

    const current = shell.getBoundingClientRect();
    const dest = slot.getBoundingClientRect();
    shell.style.transition = "none";
    shell.style.top = `${current.top}px`;
    shell.style.left = `${current.left}px`;
    shell.style.width = `${current.width}px`;
    shell.style.height = `${current.height}px`;

    let finished = false;
    const finishExit = () => {
      if (finished || fsPhaseRef.current !== "exiting") {
        return;
      }

      finished = true;
      clearShellInlineStyles();
      fsPhaseRef.current = "idle";
      setIsFullscreen(false);
      setHudVisible(true);
    };

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "width") {
        return;
      }

      shell.removeEventListener("transitionend", onEnd);
      finishExit();
    };

    shell.addEventListener("transitionend", onEnd);
    window.setTimeout(finishExit, FULLSCREEN_ANIM_MS + 80);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const ease = `${FULLSCREEN_ANIM_MS}ms ease-in`;
        shell.style.transition = `top ${ease}, left ${ease}, width ${ease}, height ${ease}, border-radius ${ease}`;
        shell.style.top = `${dest.top}px`;
        shell.style.left = `${dest.left}px`;
        shell.style.width = `${dest.width}px`;
        shell.style.height = `${dest.height}px`;
        shell.style.borderRadius = "16px";
      });
    });
  }, [isNative, clearHudHide, clearShellInlineStyles]);

  const handleExitFullscreen = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    suppressWatchNavbarBack(1000);
    if (isNative) {
      exitAppFullscreen();
      player.pause();
      return;
    }

    player.pause();
    player.fullscreen.exit();
  }, [isNative, exitAppFullscreen]);

  const enterAppFullscreenRef = useRef(enterAppFullscreen);
  enterAppFullscreenRef.current = enterAppFullscreen;
  const exitAppFullscreenRef = useRef(exitAppFullscreen);
  exitAppFullscreenRef.current = exitAppFullscreen;

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
    if (isNative) {
      enterAppFullscreen();
    }
  }, [isNative, markStarted, enterAppFullscreen]);

  useEffect(() => {
    startedRef.current = false;
    pendingStartRef.current = false;
    isPlayingRef.current = false;
    isPlaybackActiveRef.current = false;
    fsPhaseRef.current = "idle";
    isFullscreenRef.current = false;
    clearHudHide();
    clearShellInlineStyles();
    onNativeBelowShiftRef.current?.(0);
    setStarted(false);
    setIsFullscreen(false);
    setIsPlaying(false);
    setHudVisible(false);
    setPlyrRoot(null);
  }, [url, clearHudHide, clearShellInlineStyles]);

  useEffect(() => {
    onStartedChangeRef.current?.(started);
  }, [started]);

  useEffect(() => {
    return () => {
      clearHudHide();
    };
  }, [clearHudHide]);

  useEffect(() => {
    if (!isNative) {
      return;
    }

    const onHardwareExit = () => {
      handleExitFullscreen();
    };

    window.addEventListener("watch-plyr-exit-fullscreen", onHardwareExit);
    return () => {
      window.removeEventListener("watch-plyr-exit-fullscreen", onHardwareExit);
    };
  }, [isNative, handleExitFullscreen]);

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
    let syncDesktopFullscreen: (() => void) | null = null;

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
        clickToPlay: false,
        hideControls: !isNative,
        ratio: "16:9",
        controls: [
          ...(isNative ? PLYR_NATIVE_CONTROLS : PLYR_DESKTOP_CONTROLS),
        ],
        settings: ["captions", "quality", "speed"],
        tooltips: { controls: true, seek: true },
        fullscreen: {
          enabled: !isNative,
          fallback: "force",
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
        if (isNative) {
          enterAppFullscreenRef.current();
        }
      };

      player.on("ready", () => {
        if (cancelled) {
          return;
        }
        setPlyrRoot(player?.elements.container ?? null);
        if (player) {
          injectPlyrVolumeSetting(player);
        }
        tryStartFromGesture();
      });
      syncDesktopFullscreen = () => {
        if (isNative) {
          return;
        }

        const host = player?.elements.container;
        const active = Boolean(
          player?.fullscreen.active ||
            (host &&
              (document.fullscreenElement === host ||
                host.contains(document.fullscreenElement)))
        );

        isFullscreenRef.current = active;
        setIsFullscreen(active);
        if (active) {
          revealHudRef.current();
        }
      };

      player.on("enterfullscreen", () => {
        if (isNative) {
          return;
        }

        syncDesktopFullscreen?.();
      });
      document.addEventListener("fullscreenchange", syncDesktopFullscreen);
      player.on("exitfullscreen", () => {
        if (isNative) {
          return;
        }

        isFullscreenRef.current = false;
        clearHudHide();
        window.setTimeout(() => {
          setIsFullscreen(false);
          setHudVisible(true);
        }, 350);
      });
      player.on("play", () => {
        isPlayingRef.current = true;
        setIsPlaying(true);
        markStarted();
        if (isNative && fsPhaseRef.current === "idle") {
          enterAppFullscreenRef.current();
        } else if (isNative && isFullscreenRef.current) {
          revealHudRef.current();
        } else if (!isNative) {
          setHudVisible(true);
        }
      });
      player.on("playing", () => {
        isPlaybackActiveRef.current = true;
        isPlayingRef.current = true;
        setIsPlaying(true);
        if (isNative && isFullscreenRef.current) {
          scheduleHudHideRef.current();
        } else if (!isNative) {
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
        clearHudHide();
        setIsPlaying(false);
        setHudVisible(true);
        if (isFullscreenRef.current || player?.fullscreen.active) {
          revealHudRef.current();
        }
      });
      player.on("ended", () => {
        isPlayingRef.current = false;
        isPlaybackActiveRef.current = false;
        clearHudHide();
        setIsPlaying(false);
        setHudVisible(true);
        if (isNative && isFullscreenRef.current) {
          exitAppFullscreenRef.current();
        } else if (!isNative && player?.fullscreen.active) {
          player.fullscreen.exit();
        }
      });
      player.on("controlsshown", () => {
        if (!isNative || !isFullscreenRef.current) {
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
      if (syncDesktopFullscreen) {
        document.removeEventListener("fullscreenchange", syncDesktopFullscreen);
      }
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
      className={[
        "watch-plyr",
        isNative ? "watch-plyr--native" : "watch-plyr--desktop",
        started ? "watch-plyr--started" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        bgcolor: "#000",
        "--plyr-color-main": theme.palette.primary.main,
        "--plyr-range-fill-background": theme.palette.primary.main,
        "--plyr-range-thumb-background": theme.palette.primary.main,
        "--plyr-video-control-background-hover": theme.palette.primary.main,
        "--plyr-audio-control-background-hover": theme.palette.primary.main,
        "--plyr-control-toggle-checked-background": theme.palette.primary.main,
      }}
    >
      <Stack
        ref={slotRef}
        className="watch-plyr-slot"
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack
          ref={shellRef}
          className="watch-plyr-shell"
          sx={{ width: "100%", height: "100%", bgcolor: "#000" }}
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
                zIndex: 50,
              },
              "& .plyr__control--overlaid": {
                display: "none !important",
              },
            }}
          />
        </Stack>
      </Stack>

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

      {!isNative && started && plyrRoot
        ? createPortal(
            <WatchPlyrFullscreenHud
              variant="inline"
              visible={hudVisible}
              isPlaying={isPlaying}
              onSurfaceTap={handleTogglePlayback}
              onTogglePlayback={handleTogglePlayback}
            />,
            plyrRoot
          )
        : null}

      {isNative && started && !isFullscreen && plyrRoot
        ? createPortal(
            <WatchPlyrFullscreenHud
              variant="inline"
              visible={hudVisible}
              isPlaying={isPlaying}
              onSurfaceTap={handleInlineSurfaceTap}
              onTogglePlayback={handleTogglePlayback}
            />,
            plyrRoot
          )
        : null}
    </Stack>
  );
};

export default WatchPlyrPlayer;
