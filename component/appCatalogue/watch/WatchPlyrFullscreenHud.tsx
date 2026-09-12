"use client";

import ArrowBack from "@mui/icons-material/ArrowBack";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { IconButton, Stack } from "@mui/material";
import type { PointerEvent } from "react";

type WatchPlyrFullscreenHudProps = {
  visible: boolean;
  isPlaying: boolean;
  variant?: "fullscreen" | "inline";
  onSurfaceTap: () => void;
  onTogglePlayback: () => void;
  onExitFullscreen?: () => void;
};

/** Plyr's default center button is ~50px. +5px on both axes. */
const CENTER_BUTTON_SIZE = 55;

const WatchPlyrFullscreenHud = ({
  visible,
  isPlaying,
  variant = "fullscreen",
  onSurfaceTap,
  onTogglePlayback,
  onExitFullscreen,
}: WatchPlyrFullscreenHudProps) => {
  const isInline = variant === "inline";
  const handleSurfacePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onSurfaceTap();
  };

  const handleTogglePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onTogglePlayback();
  };

  const handleExitPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onExitFullscreen?.();
  };

  return (
    <Stack
      className="watch-plyr-fullscreen-hud"
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        pointerEvents: "none",
        transform: "translateZ(0)",
      }}
    >
      <Stack
        component="button"
        type="button"
        aria-label={visible ? "Hide player controls" : "Show player controls"}
        onPointerDown={handleSurfacePointerDown}
        sx={{
          position: "absolute",
          inset: 0,
          bottom: visible ? 72 : 0,
          zIndex: 1,
          pointerEvents: "auto",
          border: 0,
          p: 0,
          m: 0,
          cursor: "pointer",
          bgcolor: "rgba(0, 0, 0, 0.02)",
          appearance: "none",
          WebkitAppearance: "none",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      />

      {!isInline ? (
      <IconButton
        aria-label="Exit fullscreen"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        onPointerDown={handleExitPointerDown}
        sx={{
          position: "absolute",
          top: "max(12px, env(safe-area-inset-top, 0px))",
          right: "max(12px, env(safe-area-inset-left, 0px))",
          zIndex: 2,
          pointerEvents: visible ? "auto" : "none",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.92)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          bgcolor: "secondary.main",
          color: "white",
          boxShadow: (theme) =>
            `0 2px 10px 2px ${theme.palette.secondary.main}`,
          "&:hover": {
            bgcolor: "secondary.main",
          },
        }}
      >
        <ArrowBack sx={{ fontSize: 32 }} />
      </IconButton>
      ) : null}

      <Stack
        component="button"
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        onPointerDown={handleTogglePointerDown}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          zIndex: 3,
          width: CENTER_BUTTON_SIZE,
          height: CENTER_BUTTON_SIZE,
          minWidth: CENTER_BUTTON_SIZE,
          minHeight: CENTER_BUTTON_SIZE,
          maxWidth: CENTER_BUTTON_SIZE,
          maxHeight: CENTER_BUTTON_SIZE,
          p: 0,
          m: 0,
          border: 0,
          borderRadius: "50%",
          boxSizing: "border-box",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: visible ? "auto" : "none",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.92)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          bgcolor: "primary.main",
          color: "white",
          appearance: "none",
          WebkitAppearance: "none",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {isPlaying ? (
          <PauseRounded sx={{ fontSize: 32, color: "common.white" }} />
        ) : (
          <PlayArrowRounded sx={{ fontSize: 32, color: "common.white" }} />
        )}
      </Stack>
    </Stack>
  );
};

export default WatchPlyrFullscreenHud;
