"use client";

import {
  getPlaylistSnapshot,
  getProgress,
  subscribePlaylist,
} from "@/lib/reactions/playlistStore";
import { Box } from "@mui/material";
import { useSyncExternalStore } from "react";

const FINISHED_RATIO = 0.9;

export default function VideoProgressBar({
  videoId,
  duration,
}: {
  videoId: string;
  duration?: number;
}) {
  useSyncExternalStore(subscribePlaylist, getPlaylistSnapshot, () => 0);

  const progress = getProgress(videoId);
  const length = Number(duration) || progress?.duration || 0;
  const position = progress?.position || 0;

  if (length <= 0 || position <= 0) {
    return null;
  }

  const percent = Math.min(100, (position / length) * 100);
  const finished = position >= length * FINISHED_RATIO;

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: {
          xs: "calc(0% + 52px)",
          sm: "calc(0% + 58px)",
          md: "calc(0% + 56px)",
          lg: "calc(0% + 60px)",
        },
        height: { xs: 3, lg: 4 },
        zIndex: 3,
        bgcolor: "rgba(0, 0, 0, 0.35)",
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: `${finished ? 100 : percent}%`,
          bgcolor: "red",
        }}
      />
    </Box>
  );
}
