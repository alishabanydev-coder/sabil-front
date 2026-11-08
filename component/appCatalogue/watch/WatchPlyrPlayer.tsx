"use client";

import WatchPlayerPlayIcon from "./WatchPlayerPlayIcon";
import WatchPlyrFullscreenHud from "./WatchPlyrFullscreenHud";
import { useWatchPlyrPlayer } from "@/component/appCatalogue/hooks/useWatchPlyrPlayer";
import VideocamOffOutlined from "@mui/icons-material/VideocamOffOutlined";
import { CircularProgress, Stack, Typography, useTheme } from "@mui/material";
import { createPortal } from "react-dom";

export {
  FULLSCREEN_ANIM_MS,
  getYouTubeVideoId,
  PLYR_DESKTOP_CONTROLS,
  PLYR_NATIVE_CONTROLS,
} from "@/component/appCatalogue/hooks/useWatchPlyrPlayer";

/** Center play/pause button on the phone, after playback starts. */
export const NATIVE_PLAY_BUTTON_SIZE = 66;
export const NATIVE_PLAY_ICON_SIZE = 56;

type WatchPlyrPlayerProps = {
  url: string;
  videoId?: string;
  duration?: number;
  thumbnail?: string;
  title?: string;
  isNative: boolean;
  onStartedChange?: (started: boolean) => void;
  onNativeBelowShift?: (shiftY: number) => void;
};

const WatchPlyrPlayer = ({
  url,
  videoId,
  duration,
  thumbnail,
  title,
  isNative,
  onStartedChange,
  onNativeBelowShift,
}: WatchPlyrPlayerProps) => {
  const theme = useTheme();
  const {
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
  } = useWatchPlyrPlayer({
    url,
    videoId,
    duration,
    isNative,
    onStartedChange,
    onNativeBelowShift,
  });

  const cover =
    thumbnail && !hasFrame && !isUnavailable ? (
      <img
        src={thumbnail}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 4,
          pointerEvents: "none",
          transform: "translateZ(0)",
        }}
      />
    ) : null;

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
          onClick={(event) => {
            if (started || isUnavailable) {
              return;
            }

            const target = event.target;
            if (
              target instanceof Element &&
              target.closest(
                ".plyr__controls, .plyr__menu, .plyr__menu__container"
              )
            ) {
              return;
            }

            beginPlayback();
          }}
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
          {cover && !plyrRoot ? cover : null}
          {showSpinner && !isUnavailable ? (
            <Stack
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 30,
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <CircularProgress
                size={90}
                thickness={4}
                disableShrink
                aria-label="Loading video"
                sx={{
                  color: "primary.light",
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                    animation: "none",
                  },
                }}
              />
            </Stack>
          ) : null}
          {isUnavailable ? (
            <Stack
              role="status"
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 30,
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Stack
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  px: 2.5,
                  py: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(0, 0, 0, 0.72)",
                }}
              >
                <VideocamOffOutlined sx={{ fontSize: 48, color: "white" }} />
                <Typography sx={{ color: "white", textAlign: "center" }}>
                  Video is not available
                </Typography>
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </Stack>

      {!started && !isUnavailable ? (
        <Stack
          className="watch-player-preview"
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            pointerEvents: "none",
            bgcolor: "transparent",
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
        >
          <WatchPlayerPlayIcon />
        </Stack>
      ) : null}

      {cover && plyrRoot ? createPortal(cover, plyrRoot) : null}

      {isNative && isFullscreen && plyrRoot
        ? createPortal(
            <WatchPlyrFullscreenHud
              centerButtonSize={NATIVE_PLAY_BUTTON_SIZE}
              centerIconSize={NATIVE_PLAY_ICON_SIZE}
              visible={hudVisible}
              isPlaying={isPlaying}
              onSurfaceTap={handleTogglePlayback}
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
              centerButtonSize={72}
              centerIconSize={56}
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
              centerButtonSize={NATIVE_PLAY_BUTTON_SIZE}
              centerIconSize={NATIVE_PLAY_ICON_SIZE}
              visible={hudVisible}
              isPlaying={isPlaying}
              onSurfaceTap={handleTogglePlayback}
              onTogglePlayback={handleTogglePlayback}
            />,
            plyrRoot
          )
        : null}
    </Stack>
  );
};

export default WatchPlyrPlayer;
