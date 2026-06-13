"use client";

import { Stack } from "@mui/material";
import { useNativeApp } from "@/lib/capacitor/nativeApp";

export default function AppShellStack({
  children,
}: {
  children: React.ReactNode;
}) {
  const native = useNativeApp();

  return (
    <Stack
      className="app-shell"
      sx={{
        width: "100%",
        direction: "ltr",
        px: 0,
        pt: { xs: 1, md: 2 },
        ...(native
          ? {
              height: "100dvh",
              minHeight: "100dvh",
              overflowY: "auto",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
            }
          : {
              minHeight: "100vh",
              overflow: "visible",
            }),
      }}
    >
      {children}
    </Stack>
  );
}
