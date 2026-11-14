"use client";

import { Box } from "@mui/material";

type ToolbarOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function ToolbarOverlay({ open, onClose }: ToolbarOverlayProps) {
  if (!open) {
    return null;
  }

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        // bgcolor: "rgba(255, 255, 255, 0.14)",
        // backdropFilter: "blur(12px)",
        // WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* <Box
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "rgba(255, 255, 255, 0.22)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
        }}
      /> */}
    </Box>
  );
}
