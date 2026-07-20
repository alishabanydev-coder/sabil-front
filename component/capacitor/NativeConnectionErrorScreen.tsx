"use client";

import { PrimaryButton } from "@/component/ui/PrimaryButton";
import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";

type NativeConnectionErrorScreenProps = {
  onRetry: () => Promise<boolean> | boolean;
};

export default function NativeConnectionErrorScreen({
  onRetry,
}: NativeConnectionErrorScreenProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [hint, setHint] = useState("");

  const handleRetry = async () => {
    if (isRetrying) {
      return;
    }

    setIsRetrying(true);
    setHint("");

    try {
      const isConnected = await onRetry();
      if (!isConnected) {
        setHint("Still offline. Check Wi‑Fi or mobile data, then try again.");
      }
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Box
      component="section"
      role="alert"
      aria-live="assertive"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 20000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2.5, sm: 4 },
        py: { xs: 3, sm: 4 },
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 80% 60% at 20% 15%, rgba(255, 76, 99, 0.28), transparent 55%)," +
          "radial-gradient(ellipse 70% 55% at 85% 80%, rgba(94, 146, 252, 0.22), transparent 50%)," +
          "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(92, 12, 151, 0.55), transparent 70%)," +
          "linear-gradient(160deg, #1a0630 0%, #12041f 45%, #0a0214 100%)",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          width: { xs: 220, sm: 320 },
          height: { xs: 220, sm: 320 },
          borderRadius: "50%",
          border: "1px solid rgba(223, 255, 0, 0.18)",
          animation: "nativeOfflinePulse 2.8s ease-in-out infinite",
          "@keyframes nativeOfflinePulse": {
            "0%, 100%": {
              transform: "scale(0.92)",
              opacity: 0.35,
            },
            "50%": {
              transform: "scale(1.08)",
              opacity: 0.7,
            },
          },
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          width: { xs: 160, sm: 240 },
          height: { xs: 160, sm: 240 },
          borderRadius: "50%",
          border: "1px solid rgba(255, 76, 99, 0.25)",
          animation: "nativeOfflinePulse 2.8s ease-in-out infinite 0.4s",
        }}
      />

      <Stack
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 520,
          width: "100%",
          alignItems: "center",
          textAlign: "center",
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          sx={{
            width: { xs: 88, sm: 108 },
            height: { xs: 88, sm: 108 },
            borderRadius: "28%",
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(255, 255, 255, 0.06)",
            border: "2px solid rgba(223, 255, 0, 0.35)",
            boxShadow:
              "0 0 0 8px rgba(223, 255, 0, 0.06), 0 18px 40px rgba(0, 0, 0, 0.45)",
            mb: 0.5,
            animation: "nativeOfflineFloat 3.2s ease-in-out infinite",
            "@keyframes nativeOfflineFloat": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-8px)" },
            },
          }}
        >
          <WifiOffRoundedIcon
            sx={{
              fontSize: { xs: 42, sm: 52 },
              color: "warning.main",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontFamily: "Namecat, sans-serif",
            fontSize: { xs: "3.2rem", sm: "4.5rem" },
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: 3,
            color: "secondary.main",
            textShadow: "0 6px 24px rgba(255, 76, 99, 0.35)",
          }}
        >
          Oops!
        </Typography>

        <Typography
          sx={{
            fontFamily: '"Bhel Puri", sans-serif',
            fontWeight: 700,
            fontSize: { xs: "1.15rem", sm: "1.45rem" },
            color: "#f5f0ff",
            letterSpacing: 0.4,
          }}
        >
          Connection lost
        </Typography>

        <Typography
          sx={{
            color: "rgba(245, 240, 255, 0.72)",
            fontSize: { xs: "0.92rem", sm: "1.05rem" },
            maxWidth: 400,
            lineHeight: 1.55,
          }}
        >
          Sabeel Kids needs the internet to load stories and videos. Check your
          connection, then tap try again.
        </Typography>

        {hint ? (
          <Typography
            sx={{
              color: "warning.main",
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              fontWeight: 600,
              maxWidth: 380,
            }}
          >
            {hint}
          </Typography>
        ) : null}

        <PrimaryButton
          onClick={() => void handleRetry()}
          disabled={isRetrying}
          sx={{
            mt: 1.5,
            minWidth: { xs: 160, sm: 190 },
            fontFamily: "Namecat, sans-serif",
            fontSize: { xs: 14, sm: 16 },
            letterSpacing: 1.5,
            py: { xs: 0.9, sm: 1.15 },
          }}
        >
          {isRetrying ? (
            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} sx={{ color: "warning.main" }} />
              Checking…
            </Stack>
          ) : (
            "Try again"
          )}
        </PrimaryButton>
      </Stack>
    </Box>
  );
}
