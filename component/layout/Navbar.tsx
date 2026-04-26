"use client";

import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { ScondaryButton } from "../ui/ScondaryButton";

const navItems = [
  { label: "Contact", href: "/#contact" },
  { label: "About", href: "/#about" },
  { label: "Programs", href: "/#programs" },
  { label: "Project", href: "/#projects" },
  { label: "Home", href: "/" },
];

export default function Navbar() {
  return (
    <Box
      component="header"
      sx={{
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        gap: 2,
        top: 15,
        left: 0,
        zIndex: 10,
        width: "100%",
        px: { xs: 2, md: 8 },
      }}
    >
      <ScondaryButton>
        <Typography
          sx={{ fontSize: 18, fontFamily: "Namecat", letterSpacing: 2 }}
        >
          SIGN IN
        </Typography>
      </ScondaryButton>

      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          py: 1.5,
          borderRadius: 999,
          position: "relative",
          overflow: "hidden",
          bgcolor: "rgba(255, 255, 255, 0.28)",
          boxShadow:
            "0 3px 0 rgba(248, 240, 240, 0.0) inset, 0 -6px 0 rgba(136, 18, 84, 0.2) inset, 0 16px 28px rgba(92, 12, 151, 0.3)",
          backdropFilter: "blur(10px)",
          transform: "translateY(-1px)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-40%",
            left: "-65%",
            width: "45%",
            height: "180%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 25%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.12) 75%, transparent 100%)",
            transform: "skewX(-22deg)",
            transition: "left 0.75s ease",
            pointerEvents: "none",
          },
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0 3px 0 rgba(248, 240, 240, 0.18) inset, 0 -6px 0 rgba(136, 18, 84, 0.24) inset, 0 20px 34px rgba(92, 12, 151, 0.36)",
          },
          "&:hover::before": {
            left: "120%",
          },
        }}
      >
        <Stack direction="row" sx={{ gap: { xs: 2, md: 4 } }}>
          {navItems.map((item) => (
            <Typography
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                color: "#fff",
                fontSize: 16,
                fontFamily: "Namecat",
                letterSpacing: 2,
                textDecoration: "none",
                "&:hover": {
                  color: "primary.light",
                },
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
