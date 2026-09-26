"use client";

import { AppButton } from "@/component/ui/AppButton";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFoundView() {
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
            fontSize: { xs: "6rem", sm: "8rem" },
            fontWeight: 800,
            lineHeight: 1,
            color: "primary.main",
            fontFamily: "Namecat, sans-serif",
            letterSpacing: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          Page not found
        </Typography>

        <Typography
          sx={{
            color: "secondary.main",
            fontSize: { xs: "0.95rem", sm: "1rem" },
            maxWidth: 420,
          }}
        >
          The page you are looking for does not exist or may have been moved.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            gap: 1.5,
            mt: 1,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <AppButton tone="secondary" component={Link} href="/">
            Back to Home
          </AppButton>
          <Box
            component={Link}
            href="/app"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              px: 3,
              py: 1.25,
              borderRadius: 50,
              border: "2px solid",
              borderColor: "primary.main",
              color: "primary.main",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
              },
            }}
          >
            Open Catalogue
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
