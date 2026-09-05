"use client";

import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import { alpha, Avatar, IconButton, Skeleton, Stack, Box } from "@mui/material";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { useNavbarController } from "./useNavbarController";
import type { NavbarProps } from "./navbarTypes";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Swiper, SwiperSlide } from "swiper/react";

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
            "&:hover": {
              bgcolor: "secondary.main",
              borderColor: "#fff",
            },
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
            "&:hover": {
              bgcolor: "secondary.main",
              borderColor: "#fff",
            },
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
          width: "100%",
          pt: 11,
          mx: "auto",
          alignItems: "center",
          zIndex: 110,
          position: "relative",
        }}
      >
        <Swiper
          slidesPerView="auto"
          spaceBetween={8}
          watchOverflow={true}
          slidesOffsetBefore={16} // left padding
          slidesOffsetAfter={25}
          style={{ width: "100%", paddingTop: 8, paddingBottom: 8 }}
        >
          {navigationButtons.length > 0
            ? navigationButtons.map((item) => {
                const buttonId =
                  item.type === "project" && item.projectId
                    ? item.projectId
                    : "home";
                const isSelected = selectedNav === buttonId;

                return (
                  <SwiperSlide key={item.id} style={{ width: "auto" }}>
                    <Stack
                      sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        borderRadius: 4,
                        boxShadow: isSelected ? 3 : 5,
                        p: 0.8,
                        bgcolor: (theme) =>
                          isSelected
                            ? alpha(theme.palette.primary.main, 0.9)
                            : alpha(theme.palette.background.paper, 1),
                        backdropFilter: "blur(2px)",
                        WebkitBackdropFilter: "blur(2px)",
                        border: (theme) =>
                          isSelected
                            ? `3px solid ${alpha(
                                theme.palette.warning.main,
                                1
                              )}`
                            : "none",
                        "& img": {
                          width: 58,
                          height: 48,
                        },
                      }}
                      onClick={() => setSelectedNav(buttonId)}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={110}
                        height={110}
                        style={{ objectFit: "contain" }}
                      />
                    </Stack>
                  </SwiperSlide>
                );
              })
            : Array.from({ length: NAV_SKELETON_COUNT }, (_, index) => (
                <SwiperSlide
                  key={`nav-skeleton-${index}`}
                  style={{ width: "auto" }}
                >
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: 3,
                    }}
                  />
                </SwiperSlide>
              ))}
        </Swiper>

        <Box
          sx={{
            display: navigationButtons.length > 3 ? "block" : "none",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 80,
            pointerEvents: "none",
            background: "linear-gradient(to left, white, transparent)",
            zIndex: 1,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default NavbarMobile;
