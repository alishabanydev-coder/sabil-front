"use client";

import { AppButton } from "@/component/ui/AppButton";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";

type ErrorViewProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorView({ error, reset }: ErrorViewProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Stack
      component="main"
      sx={{
        minHeight: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        textAlign: "center",
        bgcolor: "background.default",
      }}
    >
      <Stack
        sx={{
          maxWidth: 520,
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "4rem", sm: "5rem" },
            fontWeight: 800,
            lineHeight: 1,
            color: "secondary.main",
            fontFamily: "Namecat, sans-serif",
            letterSpacing: 2,
          }}
        >
          Oops!
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          Something went wrong
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.95rem", sm: "1rem" },
            maxWidth: 420,
          }}
        >
          We hit an unexpected problem loading this page. You can try again or
          go back to a safe place.
        </Typography>

        {process.env.NODE_ENV === "development" && error.message ? (
          <Typography
            component="pre"
            sx={{
              mt: 1,
              p: 1.5,
              maxWidth: "100%",
              overflow: "auto",
              textAlign: "left",
              fontSize: 12,
              borderRadius: 1,
              bgcolor: "action.hover",
              color: "text.secondary",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {error.message}
          </Typography>
        ) : null}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            gap: 1.5,
            mt: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AppButton tone="secondary" onClick={reset}>
            Try again
          </AppButton>
          <AppButton tone="secondary" component={Link} href="/">
            Back to Home
          </AppButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
