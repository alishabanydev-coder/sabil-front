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
        top: 15,
        left: 0,
        right: 0,
        zIndex: 100,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "start",
        px: { xs: 3, md: 4 },
      }}
    >
      <Stack
        sx={{
          "& img": {
            width: { xs: isNative ? 84 : 52, md: 100 },
            height: { xs: isNative ? 84 : 52, md: 100 },
          },
        }}
      >
        <Image src="/new-logo.png" alt="logo" width={80} height={80} />
      </Stack>
      <Stack>
        <IconButton
          onClick={() => (isNative ? router.replace("/app") : router.back())}
          sx={{
            bgcolor: "secondary.main",
            color: "white",
            boxShadow: (theme) =>
              `0 2px 10px 2px ${theme.palette.secondary.main}`,
            "&:hover": {
              bgcolor: "secondary.main",
              boxShadow: (theme) =>
                `0 3px 10px 4px ${theme.palette.secondary.main}`,
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
