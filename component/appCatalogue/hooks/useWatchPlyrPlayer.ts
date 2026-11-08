"use client";

import { suppressWatchNavbarBack } from "../utils/suppressWatchNavbarBack";
import {
  getProgress,
  isWatched,
  markWatched,
  setProgress,
} from "@/lib/reactions/playlistStore";
import { setViewTotal } from "@/lib/reactions/reactionStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { countAppView } from "../services/reactionsApi";

const HUD_HIDE_MS = 5000;
const DESKTOP_HUD_HIDE_MS = 4000;
const DESKTOP_FULLSCREEN_HUD_HIDE_MS = 4000;
export const FULLSCREEN_ANIM_MS = 380;
const WATCHED_AFTER_SECONDS = 30;
const FIRST_VIEW_SECONDS = 30;
const REWATCH_VIEW_SECONDS = 45;
const REWATCH_START_MAX_SECONDS = 10;
const PROGRESS_SAVE_EVERY_SECONDS = 5;
const SEEK_GAP_SECONDS = 1.5;
const RESUME_MIN_SECONDS = 5;
const FINISHED_RATIO = 0.9;

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

type UseWatchPlyrPlayerArgs = {
  url: string;
  videoId?: string;
  duration?: number;
  isNative: boolean;
  onStartedChange?: (started: boolean) => void;
  onNativeBelowShift?: (shiftY: number) => void;
};

export function useWatchPlyrPlayer({
  url,
  videoId,
  duration,
  isNative,
  onStartedChange,
  onNativeBelowShift,
}: UseWatchPlyrPlayerArgs) {
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
  const hasPlayedRef = useRef(false);
  const hasFrameRef = useRef(false);
  const unavailableRef = useRef(false);
  const hudHideTimeoutRef = useRef<number | null>(null);
  const videoIdRef = useRef(videoId);
  const durationRef = useRef(duration);
  const lastTickRef = useRef(0);
  const playedRef = useRef(0);
  const lastSavedPlayedRef = useRef(0);
  const markedWatchedRef = useRef(false);
  const isRewatchRef = useRef(false);
  const firstViewPostedRef = useRef(false);
  const rewatchFromStartRef = useRef(false);
  const sessionRewatchPlayedRef = useRef(0);
  const rewatchViewPostedRef = useRef(false);
  const resumedRef = useRef(false);
  const resumeHoldRef = useRef(0);
  const [started, setStarted] = useState(false);
  const [plyrRoot, setPlyrRoot] = useState<HTMLElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hudVisible, setHudVisible] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const youtubeId = getYouTubeVideoId(url);
  videoIdRef.current = videoId;
  durationRef.current = duration;

  const onNativeBelowShiftRef = useRef(onNativeBelowShift);
  onStartedChangeRef.current = onStartedChange;
  onNativeBelowShiftRef.current = onNativeBelowShift;

  const mediaDuration = useCallback((player: PlyrPlayer) => {
    return (
      Number(durationRef.current) ||
      Number(player.duration) ||
      getProgress(videoIdRef.current || "")?.duration ||
      0
    );
  }, []);

  const resumeTarget = useCallback(
    (player: PlyrPlayer) => {
      const id = videoIdRef.current?.trim();
      if (!id) {
        return 0;
      }

      const saved = getProgress(id);
      if (!saved) {
        return 0;
      }

      const length = mediaDuration(player);
      if (
        length <= 0 ||
        saved.position <= RESUME_MIN_SECONDS ||
        saved.position >= length * FINISHED_RATIO
      ) {
        return 0;
      }

      return saved.position;
    },
    [mediaDuration]
  );

  const paintSeekBar = useCallback((player: PlyrPlayer, seconds: number) => {
    const seek = player.elements.container?.querySelector('[data-plyr="seek"]');
    if (!(seek instanceof HTMLInputElement)) {
      return;
    }

    const length =
      Number(player.duration) ||
      Number(durationRef.current) ||
      getProgress(videoIdRef.current || "")?.duration ||
      0;
    if (length <= 0) {
      return;
    }

    const percent = Math.min(100, Math.max(0, (seconds / length) * 100));
    seek.value = percent.toFixed(2);
    const max = Number(seek.max) || 100;
    seek.style.setProperty("--value", `${(percent / max) * 100}%`);
  }, []);

  const paintCurrentTime = useCallback(
    (player: PlyrPlayer, seconds: number) => {
      const label = player.elements.container?.querySelector(
        ".plyr__time--current"
      );
      if (!label) {
        return;
      }

      const length =
        Number(player.duration) ||
        Number(durationRef.current) ||
        getProgress(videoIdRef.current || "")?.duration ||
        0;
      const total = Math.max(0, Math.floor(seconds));
      const hours = Math.floor(total / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const secs = total % 60;
      const pad = (value: number) => String(value).padStart(2, "0");
      label.textContent =
        length >= 3600 || hours > 0
          ? `${hours}:${pad(minutes)}:${pad(secs)}`
          : `${pad(minutes)}:${pad(secs)}`;
    },
    []
  );

  const holdSeekDisplay = useCallback(
    (player: PlyrPlayer) => {
      const hold = resumeHoldRef.current;
      const clock = Number(player.currentTime) || 0;
      const shown = hold > 0 ? hold : clock;
      if (shown <= 0) {
        return;
      }

      if (!player.duration || (hold > 0 && Math.abs(clock - hold) > 1.5)) {
        paintSeekBar(player, shown);
        paintCurrentTime(player, shown);
        return;
      }

      if (hold > 0) {
        resumeHoldRef.current = 0;
      }
    },
    [paintCurrentTime, paintSeekBar]
  );

  const tryResume = useCallback(
    (player: PlyrPlayer) => {
      if (resumedRef.current) {
        return;
      }

      const id = videoIdRef.current?.trim();
      if (!id) {
        return;
      }

      const saved = getProgress(id);
      const position =
        resumeHoldRef.current > 0
          ? resumeHoldRef.current
          : resumeTarget(player);
      if (!position) {
        if (!saved || mediaDuration(player) > 0) {
          resumedRef.current = true;
        }
        return;
      }

      // Plyr ignores currentTime until the length is known. Keep retrying.
      if (!player.duration) {
        resumeHoldRef.current = position;
        paintSeekBar(player, position);
        return;
      }

      resumeHoldRef.current = position;
      const clock = Number(player.currentTime) || 0;
      if (Math.abs(clock - position) > 1.5) {
        player.currentTime = position;
      }
      paintSeekBar(player, position);
      resumedRef.current = true;
    },
    [mediaDuration, paintSeekBar, resumeTarget]
  );

  const flushProgress = useCallback(
    (player: PlyrPlayer | null, ended = false) => {
      const id = videoIdRef.current?.trim();
      if (!id || !player) {
        return;
      }

      const clock = Number(player.currentTime) || 0;
      const hold = resumeHoldRef.current;
      const now = hold > 0 && clock + 1 < hold ? hold : clock;
      const length = mediaDuration(player);

      if (ended) {
        markWatched(id);
        markedWatchedRef.current = true;
        setProgress(
          id,
          length > 0 ? length : now,
          length || now,
          playedRef.current
        );
        lastSavedPlayedRef.current = playedRef.current;
        return;
      }

      if (now > 0) {
        setProgress(id, now, length, playedRef.current);
        lastSavedPlayedRef.current = playedRef.current;
      }
    },
    [mediaDuration]
  );

  const postAppView = useCallback((id: string) => {
    void countAppView(id).then((result) => {
      if (result.ok) {
        setViewTotal(id, result.count);
      }
    });
  }, []);

  const trackPlayback = useCallback(
    (player: PlyrPlayer) => {
      const id = videoIdRef.current?.trim();
      if (!id || unavailableRef.current) {
        return;
      }

      const now = Number(player.currentTime) || 0;
      const lastTick = lastTickRef.current;
      const delta = lastTick === 0 ? 0 : now - lastTick;
      const seeked = delta < 0 || delta > SEEK_GAP_SECONDS;
      const inRewatchStart =
        now <= REWATCH_START_MAX_SECONDS && !player.seeking;

      if (isRewatchRef.current && inRewatchStart) {
        if (!rewatchFromStartRef.current || seeked) {
          rewatchFromStartRef.current = true;
          sessionRewatchPlayedRef.current = 0;
        }
      }

      if (player.paused || player.seeking || !isPlaybackActiveRef.current) {
        lastTickRef.current = now;
        return;
      }

      lastTickRef.current = now;
      const playedTick = delta > 0 && delta <= SEEK_GAP_SECONDS ? delta : 0;
      if (playedTick) {
        playedRef.current += playedTick;
      }

      if (
        playedRef.current >= WATCHED_AFTER_SECONDS &&
        !markedWatchedRef.current
      ) {
        markWatched(id);
        markedWatchedRef.current = true;
      }

      if (!isRewatchRef.current) {
        if (
          !firstViewPostedRef.current &&
          playedRef.current >= FIRST_VIEW_SECONDS
        ) {
          firstViewPostedRef.current = true;
          isRewatchRef.current = true;
          markWatched(id);
          markedWatchedRef.current = true;
          postAppView(id);
        }
      } else if (
        rewatchFromStartRef.current &&
        !rewatchViewPostedRef.current &&
        playedTick
      ) {
        sessionRewatchPlayedRef.current += playedTick;
        if (sessionRewatchPlayedRef.current >= REWATCH_VIEW_SECONDS) {
          rewatchViewPostedRef.current = true;
          postAppView(id);
        }
      }

      if (
        playedRef.current - lastSavedPlayedRef.current >=
        PROGRESS_SAVE_EVERY_SECONDS
      ) {
        setProgress(id, now, mediaDuration(player), playedRef.current);
        lastSavedPlayedRef.current = playedRef.current;
      }
    },
    [mediaDuration, postAppView]
  );

  useEffect(() => {
    const saved = videoId ? getProgress(videoId) : null;
    lastTickRef.current = 0;
    playedRef.current = saved?.played || 0;
    lastSavedPlayedRef.current = playedRef.current;
    const alreadyWatched = Boolean(
      videoId &&
        (isWatched(videoId) || playedRef.current >= WATCHED_AFTER_SECONDS)
    );
    markedWatchedRef.current = alreadyWatched;
    isRewatchRef.current = alreadyWatched;
    firstViewPostedRef.current = alreadyWatched;
    rewatchFromStartRef.current = false;
    sessionRewatchPlayedRef.current = 0;
    rewatchViewPostedRef.current = false;
    if (videoId && alreadyWatched) {
      markWatched(videoId);
    }
    resumedRef.current = false;
    resumeHoldRef.current = 0;
  }, [videoId]);

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
    if (unavailableRef.current) {
      return;
    }

    const player = playerRef.current;
    pendingStartRef.current = true;
    markStarted();
    setShowSpinner(true);

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
    hasPlayedRef.current = false;
    hasFrameRef.current = false;
    unavailableRef.current = false;
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
    setShowSpinner(false);
    setIsUnavailable(false);
    setHasFrame(false);
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

      const savedProgress = videoIdRef.current?.trim()
        ? getProgress(videoIdRef.current.trim())
        : null;
      const knownDuration =
        Number(durationRef.current) || savedProgress?.duration || 0;
      const resumeAt = (() => {
        if (
          !savedProgress ||
          knownDuration <= 0 ||
          savedProgress.position <= RESUME_MIN_SECONDS ||
          savedProgress.position >= knownDuration * FINISHED_RATIO
        ) {
          return 0;
        }

        return savedProgress.position;
      })();
      if (resumeAt > 0) {
        resumeHoldRef.current = resumeAt;
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
        ...(knownDuration > 0 ? { duration: knownDuration } : {}),
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
          ...(resumeAt > 0 ? { start: Math.floor(resumeAt) } : {}),
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
          const seek =
            player.elements.container?.querySelector('[data-plyr="seek"]');
          seek?.addEventListener("input", () => {
            if (!player || !(seek instanceof HTMLInputElement)) {
              return;
            }

            const length =
              Number(player.duration) ||
              Number(durationRef.current) ||
              getProgress(videoIdRef.current || "")?.duration ||
              0;
            if (length <= 0) {
              return;
            }

            const max = Number(seek.max) || 100;
            const seconds = (Number(seek.value) / max) * length;
            resumeHoldRef.current = seconds;
            player.currentTime = seconds;
            seek.style.setProperty(
              "--value",
              `${(Number(seek.value) / max) * 100}%`
            );
            paintCurrentTime(player, seconds);
            if (seconds > 0.05) {
              hasFrameRef.current = true;
              setHasFrame(true);
            }
          });
          tryResume(player);
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
      player.on("timeupdate", () => {
        if (
          hasFrameRef.current ||
          unavailableRef.current ||
          !player ||
          player.currentTime <= 0.05
        ) {
          return;
        }

        hasFrameRef.current = true;
        setHasFrame(true);
        if (!unavailableRef.current) {
          setShowSpinner(false);
        }
      });
      player.on("timeupdate", () => {
        if (!player || unavailableRef.current) {
          return;
        }

        holdSeekDisplay(player);
        trackPlayback(player);
      });
      player.on("seeked", () => {
        if (player) {
          holdSeekDisplay(player);
        }
      });
      const onDurationChange = player.on as (
        event: "durationchange",
        callback: () => void
      ) => void;
      onDurationChange("durationchange", () => {
        if (!player) {
          return;
        }

        const hold = resumeHoldRef.current;
        if (hold > 0) {
          const clock = Number(player.currentTime) || 0;
          if (player.duration && Math.abs(clock - hold) > 1.5) {
            player.currentTime = hold;
          }
          holdSeekDisplay(player);
        }

        tryResume(player);
      });
      player.on("playing", () => {
        hasPlayedRef.current = true;
        isPlaybackActiveRef.current = true;
        isPlayingRef.current = true;
        setIsPlaying(true);
        if (player) {
          tryResume(player);
        }
        if (!unavailableRef.current && hasFrameRef.current) {
          setShowSpinner(false);
        }
        if (isNative && isFullscreenRef.current) {
          scheduleHudHideRef.current();
        } else if (!isNative) {
          scheduleHudHideRef.current();
        }
      });
      player.on("waiting", () => {
        isPlaybackActiveRef.current = false;
        clearHudHide();
        if (
          startedRef.current &&
          isPlayingRef.current &&
          !unavailableRef.current
        ) {
          setShowSpinner(true);
        }
      });
      player.on("pause", () => {
        isPlayingRef.current = false;
        isPlaybackActiveRef.current = false;
        clearHudHide();
        setIsPlaying(false);
        if (hasPlayedRef.current && !unavailableRef.current) {
          setShowSpinner(false);
        }
        setHudVisible(true);
        if (isFullscreenRef.current || player?.fullscreen.active) {
          revealHudRef.current();
        }
        if (player) {
          flushProgress(player);
        }
      });
      player.on("ended", () => {
        isPlayingRef.current = false;
        isPlaybackActiveRef.current = false;
        clearHudHide();
        setIsPlaying(false);
        setShowSpinner(false);
        setHudVisible(true);
        if (player) {
          flushProgress(player, true);
        }
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
      player.on("error", () => {
        unavailableRef.current = true;
        isPlayingRef.current = false;
        isPlaybackActiveRef.current = false;
        clearHudHide();
        setIsPlaying(false);
        setShowSpinner(false);
        setIsUnavailable(true);
      });

      playerRef.current = player;
      tryStartFromGesture();
    };

    const onPageHide = () => {
      flushProgress(player);
    };
    window.addEventListener("pagehide", onPageHide);

    void setup().catch(() => {
      if (cancelled) {
        return;
      }

      unavailableRef.current = true;
      setShowSpinner(false);
      setIsUnavailable(true);
    });

    return () => {
      cancelled = true;
      window.removeEventListener("pagehide", onPageHide);
      if (syncDesktopFullscreen) {
        document.removeEventListener("fullscreenchange", syncDesktopFullscreen);
      }
      flushProgress(player);
      playerRef.current = null;
      setPlyrRoot(null);
      setIsFullscreen(false);
      setHudVisible(false);
      player?.destroy();
      container.innerHTML = "";
    };
  }, [
    youtubeId,
    isNative,
    markStarted,
    clearHudHide,
    tryResume,
    trackPlayback,
    flushProgress,
    paintSeekBar,
    paintCurrentTime,
    holdSeekDisplay,
  ]);

  return {
    containerRef,
    slotRef,
    shellRef,
    youtubeId,
    started,
    plyrRoot,
    isFullscreen,
    isPlaying,
    hudVisible,
    showSpinner,
    isUnavailable,
    hasFrame,
    beginPlayback,
    handleTogglePlayback,
    handleExitFullscreen,
  };
}
