"use client";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Box, keyframes } from "@mui/material";

const pulseRing = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.45);
    opacity: 0;
  }
  100% {
    transform: scale(1.45);
    opacity: 0;
  }
`;

const WatchPlayerPlayIcon = () => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      width: { xs: 64, sm: 80, md: 96 },
      height: { xs: 64, sm: 80, md: 96 },
      pointerEvents: "none",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: "30px solid",
        borderColor: "warning.main",
        animation: `${pulseRing} 1.4s ease-out infinite`,
      }}
    />
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        border: "4px solid",
        borderColor: "#5e92fc",
        boxShadow: 10,
        transition: "transform 0.2s ease",
        ".react-player__preview:hover &, .watch-player-preview:hover &": {
          transform: "scale(1.08)",
        },
      }}
    >
      <PlayArrowRoundedIcon
        sx={{
          fontSize: { xs: 50, sm: 54, md: 84, lg: 90 },
          color: "common.white",
          ml: 0,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
        }}
      />
    </Box>
  </Box>
);

export default WatchPlayerPlayIcon;
