"use client";

import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import { alpha, Avatar, IconButton, Skeleton, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useNavbarController } from "./useNavbarController";
import type { NavbarProps } from "./navbarTypes";

const NAV_SKELETON_COUNT = 4;

const NavbarCapacitor = ({
  navigationButtons,
  selectedNav,
  setSelectedNav,
}: NavbarProps) => {
  const { handleLogout } = useNavbarController();

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        height: "30%",
        minHeight: 0,
        flexShrink: 0,
        alignItems: "center",
        px: 2,
        gap: 1.5,
        pl: "max(16px, env(safe-area-inset-left))",
        pr: "max(16px, env(safe-area-inset-right))",
        pt: "env(safe-area-inset-top)",
      }}
    >
      <Stack
        sx={{
          flexShrink: 0,
          height: "78%",
          aspectRatio: "1 / 1",
          position: "relative",
        }}
      >
        <Image
          src="/new-logo.png"
          alt="sabeel kids logo"
          fill
          sizes="80px"
          style={{ objectFit: "contain" }}
        />
      </Stack>

      <Stack
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          px: 1,
          justifyContent: "center",
          "& .swiper": {
            width: "100%",
            height: "100%",
          },
          "& .swiper-wrapper": {
            height: "100%",
          },
          "& .swiper-slide": {
            width: "auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <Swiper
          slidesPerView="auto"
          spaceBetween={8}
          watchOverflow
          centerInsufficientSlides
          style={{ width: "100%", height: "100%" }}
        >
          {navigationButtons.length > 0
            ? navigationButtons.map((item) => {
                const buttonId =
                  item.type === "project" && item.projectId
                    ? item.projectId
                    : "home";
                const isSelected = selectedNav === buttonId;

                return (
                  <SwiperSlide key={item.id}>
                    <Stack
                      onClick={() => setSelectedNav(buttonId)}
                      sx={{
                        height: "50%",
                        aspectRatio: "1 / 1",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        borderRadius: 2,
                        p: 0.8,
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
                          objectFit: "contain",
                        },
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={72}
                        height={72}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Stack>
                  </SwiperSlide>
                );
              })
            : Array.from({ length: NAV_SKELETON_COUNT }, (_, index) => (
                <SwiperSlide key={`nav-skeleton-${index}`}>
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                      height: "72%",
                      aspectRatio: "1 / 1",
                      borderRadius: 2,
                    }}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      </Stack>

      <Stack
        direction="row"
        sx={{
          flexShrink: 0,
          gap: 1,
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={handleLogout}
          sx={{
            width: 50,
            height: 50,
            p: 0,
            color: "#fff",
            bgcolor: "secondary.main",
            border: "1px solid",
            borderColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
            "&:hover": {
              bgcolor: "secondary.light",
            },
          }}
        >
          <LogoutIcon sx={{ fontSize: 22 }} />
        </IconButton>

        <Avatar
          src="/userAvatar.png"
          alt="avatar"
          sx={{
            width: 50,
            height: 50,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default NavbarCapacitor;
