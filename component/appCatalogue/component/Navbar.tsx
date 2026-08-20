"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Button,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { isNativeApp, useNativeApp } from "@/lib/capacitor/nativeApp";

const Navbar = () => {
  const theme = useTheme();
  const router = useRouter();
  const isNative = useNativeApp();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showFloatingLogout, setShowFloatingLogout] = useState(false);

  const handleLogout = () => {
    if (isNativeApp()) {
      void App.exitApp();
      return;
    }

    router.push("/");
  };

  useEffect(() => {
    const scrollRoot = isNative
      ? document.querySelector<HTMLElement>(".app-shell")
      : null;

    const getScrollOffset = () =>
      scrollRoot ? scrollRoot.scrollTop : window.scrollY;

    const onScroll = () => {
      setShowFloatingLogout(getScrollOffset() > 80);
    };

    onScroll();

    const target: HTMLElement | Window = scrollRoot ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", onScroll);
    };
  }, [isNative]);

  return (
    <>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 4 },
        }}
      >
        <Stack
          direction="row"
          sx={{
            gap: 1,
            alignItems: "center",
            "& img": {
              width: { xs: 45, sm: 45, md: 54, lg: 62 },
              height: { xs: 45, sm: 45, md: 54, lg: 62 },
            },
          }}
        >
          <Image
            src="/icon-512.webp"
            alt="Project Title"
            width={56}
            height={56}
          />
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: { xs: 20, sm: 22, md: 28, lg: 34 },
              fontWeight: 700,
              fontFamily: "Bhel Puri",
              textTransform: "uppercase",
              color: "primary.main",
            }}
          >
            Sabeel Kids
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
          {!isNative && isMobile && (
            <>
              <IconButton
                color="primary"
                href="/downloads/sabeel-kids.apk"
                download
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  borderRadius: 3,
                  width: 30,
                  height: 30,
                  border: "1px solid",
                  borderColor: "primary.main",
                  bgcolor: "background.paper",
                  backdropFilter: "blur(8px)",
                  boxShadow: (theme) =>
                    `0 8px 22px -10px ${theme.palette.primary.main}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "background.paper",
                    boxShadow: (theme) =>
                      `0 8px 22px -6px ${theme.palette.primary.main}`,
                  },
                }}
                aria-label="download app"
              >
                <FileDownloadIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <Button
                color="primary"
                href="/downloads/sabeel-kids.apk"
                download
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  borderRadius: 3,
                  width: 46,
                  height: 46,
                  minWidth: 46,
                  border: "1px solid",
                  borderColor: "primary.main",
                  bgcolor: "background.paper",
                  backdropFilter: "blur(8px)",
                  boxShadow: (theme) =>
                    `0 8px 22px -10px ${theme.palette.primary.main}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "background.paper",
                    boxShadow: (theme) =>
                      `0 8px 22px -6px ${theme.palette.primary.main}`,
                  },
                }}
                aria-label="download app"
              >
                <FileDownloadIcon sx={{ fontSize: 24 }} />
              </Button>
            </>
          )}
          <Button
            onClick={handleLogout}
            variant="contained"
            color="primary"
            startIcon={<LogoutIcon />}
            sx={{
              fontSize: { xs: 12, sm: 14, md: 16, lg: 18 },
              py: { xs: 0.5, sm: 0.4 },
              px: { xs: 1, sm: 1.5, md: 2 },
            }}
          >
            {isNative ? "Logout" : "back"}
          </Button>
        </Stack>
      </Stack>

      {showFloatingLogout && (
        <Stack
          sx={{
            flexDirection: "row",
            position: "fixed",
            top: { xs: isNative ? 30 : 37, md: 48 },
            right: { xs: isNative ? 30 : 12, md: 24 },
            zIndex: 1000,
            gap: 1,
          }}
        >
          {!isNative && (
            <IconButton
              color="primary"
              component="a"
              href="/downloads/sabeel-kids.apk"
              download
              sx={{
                width: { xs: 30, md: 46 },
                height: { xs: 30, md: 46 },
                border: "1px solid",
                borderColor: "primary.main",
                bgcolor: "background.paper",
                backdropFilter: "blur(8px)",
                boxShadow: (theme) =>
                  `0 8px 22px -10px ${theme.palette.primary.main}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "background.paper",
                  boxShadow: (theme) =>
                    `0 8px 22px -6px ${theme.palette.primary.main}`,
                },
              }}
              aria-label="download app"
            >
              <FileDownloadIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
            </IconButton>
          )}
          <IconButton
            onClick={handleLogout}
            color="primary"
            sx={{
              width: { xs: isNative ? 48 : 30, md: 46 },
              height: { xs: isNative ? 48 : 30, md: 46 },
              border: "1px solid",
              borderColor: "primary.main",
              bgcolor: "background.paper",
              backdropFilter: "blur(8px)",
              boxShadow: (theme) =>
                `0 8px 22px -10px ${theme.palette.primary.main}`,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "background.paper",
                boxShadow: (theme) =>
                  `0 8px 22px -6px ${theme.palette.primary.main}`,
              },
            }}
            aria-label="logout"
          >
            <LogoutIcon sx={{ fontSize: { xs: isNative ? 25 : 20, md: 24 } }} />
          </IconButton>
        </Stack>
      )}
    </>
  );
};

export default Navbar;
