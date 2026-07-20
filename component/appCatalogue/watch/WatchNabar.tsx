"use client";

import { useNativeApp } from "@/lib/capacitor/nativeApp";
import { ArrowBack } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const WatchNabar = () => {
  const router = useRouter();
  const isNative = useNativeApp();

  return (
    <Stack
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 2, md: 4 },
      }}
    >
      <Stack
        sx={{
          "& img": {
            width: { xs: isNative ? 72 : 52, md: 80 },
            height: { xs: isNative ? 72 : 52, md: 80 },
          },
        }}
      >
        <Image src="/icon-512.webp" alt="logo" width={80} height={80} />
      </Stack>
      <Stack>
        <IconButton
          onClick={() => router.back()}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            boxShadow: (theme) =>
              `0 2px 10px 2px ${theme.palette.primary.main}`,
            "&:hover": {
              bgcolor: "primary.main",
              boxShadow: (theme) =>
                `0 3px 10px 4px ${theme.palette.primary.main}`,
              "& .MuiSvgIcon-root": {
                scale: 1.4,
                transition: "all 0.3s ease-out",
              },
            },
          }}
        >
          <ArrowBack sx={{ fontSize: { xs: isNative ? 32 : 24, md: 32 } }} />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default WatchNabar;
