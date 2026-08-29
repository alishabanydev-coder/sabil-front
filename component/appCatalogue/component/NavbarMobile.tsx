"use client";

import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import { alpha, Avatar, IconButton, Skeleton, Stack } from "@mui/material";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { useNavbarController } from "./useNavbarController";
import type { NavbarProps } from "./navbarTypes";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const NAV_SKELETON_COUNT = 4;

const NavbarMobile = ({
  allVideos,
  navigationButtons,
  selectedNav,
  setSelectedNav,
}: NavbarProps) => {
  const { router, isReady, handleLogout } = useNavbarController();

  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        flexShrink: 0,
      }}
    >
      {/* logo */}
      <Stack
        sx={{
          position: "absolute",
          top: 15,
          left: 20,
        }}
      >
        <Image
          className="logo"
          src="/new-logo.png"
          alt="sabeel kids logo"
          width={60}
          height={60}
        />
      </Stack>

      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: "center",
          position: "absolute",
          top: 25,
          right: 20,
          zIndex: 120,
        }}
      >
        <IconButton
          href="/downloads/sabeel-kids.apk"
          download
          sx={{
            width: 32,
            height: 32,
            p: 0,
            color: "#fff",
            bgcolor: "secondary.main",
            border: "1px solid",
            borderColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
          }}
        >
          <FileDownloadIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <IconButton
          onClick={handleLogout}
          sx={{
            width: 32,
            height: 32,
            p: 0,
            color: "#fff",
            bgcolor: "secondary.main",
            border: "1px solid",
            borderColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
          }}
        >
          <LogoutIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <Avatar
          src="/userAvatar.png"
          alt="avatar"
          sx={{
            width: 32,
            height: 32,
          }}
        />
      </Stack>

      <Stack
        direction="row"
        sx={{
          gap: 1,
          width: "90%",
          pt: 11,
          mx: "auto",
          alignItems: "center",
          zIndex: 110,
        }}
      >
        <Stack
          sx={{
            width: "80%",
            mx: "auto",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          {navigationButtons.length > 0
            ? navigationButtons.map((item) => {
                const buttonId =
                  item.type === "project" && item.projectId
                    ? item.projectId
                    : "home";
                const isSelected = selectedNav === buttonId;
                return (
                  <Stack
                    key={item.id}
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      borderRadius: 3,
                      p: 1,
                      bgcolor: (theme) =>
                        isSelected
                          ? alpha(theme.palette.primary.main, 0.5)
                          : alpha(theme.palette.background.paper, 0.08),
                      backdropFilter: "blur(2px)",
                      WebkitBackdropFilter: "blur(2px)",
                      border: "3px solid",
                      borderColor: (theme) =>
                        isSelected
                          ? alpha(theme.palette.warning.main, 0.7)
                          : alpha(theme.palette.background.paper, 0.15),
                      "& img": {
                        filter: isSelected ? "none" : "grayscale(100%)",
                        width: 45,
                        height: 40,
                      },
                    }}
                    onClick={() => {
                      setSelectedNav(buttonId);
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={110}
                      height={110}
                      style={{ objectFit: "contain" }}
                    />
                  </Stack>
                );
              })
            : Array.from({ length: NAV_SKELETON_COUNT }, (_, index) => (
                <Skeleton
                  key={`nav-skeleton-${index}`}
                  variant="rounded"
                  animation="wave"
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius: 3,
                  }}
                />
              ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NavbarMobile;
