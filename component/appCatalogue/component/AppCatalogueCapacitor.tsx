"use client";

import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { AppCatalogueProps, NavigationButtonData } from "./navbarTypes";

const CARD_SKELETON_COUNT = 4;

export default function AppCatalogueCapacitor({
  navigationButtons,
  selectedVideos,
  homeVideos,
  allVideos,
}: AppCatalogueProps) {
  const router = useRouter();

  const projectById = useMemo(() => {
    const projectMap = new Map<string, { title: string; image: string }>();
    navigationButtons
      .filter(
        (button): button is NavigationButtonData & { projectId: string } =>
          button.type === "project" && typeof button.projectId === "string"
      )
      .forEach((button) => {
        projectMap.set(button.projectId, {
          title: button.title,
          image: button.image,
        });
      });
    return projectMap;
  }, [navigationButtons]);

  const isCatalogueLoading =
    navigationButtons.length === 0 &&
    homeVideos.length === 0 &&
    allVideos.length === 0;

  return (
    <Stack
      sx={{
        width: "100%",
        height: "80%",
        minHeight: 0,
        pb: "env(safe-area-inset-bottom)",
        pl: "max(16px, env(safe-area-inset-left))",
        pr: "max(16px, env(safe-area-inset-right))",
        "& .swiper": {
          width: "100%",
          height: "100%",
          py: 1,
        },
        "& .swiper-wrapper": {
          height: "100%",
        },
        "& .swiper-slide": {
          height: "100%",
        },
      }}
    >
      <Swiper
        slidesPerView={3.2}
        spaceBetween={16}
        watchOverflow
        observer
        observeParents
        breakpoints={{
          0: { slidesPerView: 2.3, spaceBetween: 12 },
          900: { slidesPerView: 3.2, spaceBetween: 16 },
          1200: { slidesPerView: 4.2, spaceBetween: 20 },
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {isCatalogueLoading
          ? Array.from({ length: CARD_SKELETON_COUNT }, (_, index) => (
              <SwiperSlide key={`card-skeleton-${index}`}>
                <Stack
                  sx={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "white",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{ width: "100%", height: "100%" }}
                  />
                </Stack>
              </SwiperSlide>
            ))
          : selectedVideos.map((item) => {
              const project = projectById.get(item.projectId);
              const projectName = project?.title || "Project";

              return (
                <SwiperSlide key={item._id}>
                  <Stack
                    onClick={() => router.push(`/app/watch/${item._id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/app/watch/${item._id}`);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    sx={{
                      position: "relative",
                      height: "100%",
                      width: "100%",
                      borderRadius: 4,
                      boxShadow: 3,
                      cursor: "pointer",
                      overflow: "hidden",
                      bgcolor: "white",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: (theme) =>
                          `0px 2px 10px 1px ${theme.palette.primary.main}`,
                        "& .app-catalogue-capacitor-image": {
                          transform: "scale(1.06)",
                        },
                        "& .app-catalogue-capacitor-play-button": {
                          transform: "scale(1.1)",
                        },
                      },
                    }}
                  >
                    <Image
                      className="app-catalogue-capacitor-image"
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="40vw"
                      style={{
                        objectFit: "contain",
                        transition: "transform 0.3s ease",
                      }}
                    />

                    <Stack
                      direction="row"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <Stack
                        sx={{
                          width: "100%",
                          bgcolor: "white",
                          borderRadius: 300,
                          boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.5)",
                          pl: 7,
                          pr: 1.5,
                          position: "relative",
                          py: 0.75,
                        }}
                      >
                        <Box
                          className="app-catalogue-capacitor-play-button"
                          sx={{
                            position: "absolute",
                            left: 10,
                            top: -18,
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            boxShadow: 5,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            bgcolor: "white",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <PlayArrowRoundedIcon
                            sx={{
                              fontSize: 32,
                              color: "primary.main",
                            }}
                          />
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{
                            color: "primary.main",
                            fontFamily: "Namecat",
                            fontWeight: 700,
                            fontSize: 14,
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            lineHeight: 1,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "text.secondary",
                            fontWeight: 300,
                            fontFamily: "Namecat",
                            letterSpacing: 2,
                            fontSize: 11,
                          }}
                        >
                          {projectName}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </SwiperSlide>
              );
            })}
      </Swiper>
    </Stack>
  );
}
