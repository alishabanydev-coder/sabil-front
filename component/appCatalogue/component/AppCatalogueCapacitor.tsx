"use client";

import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import type { AppCatalogueProps, NavigationButtonData } from "./navbarTypes";

const CARD_SKELETON_COUNT = 4;
const CARD_ASPECT = 16 / 9;
const SHADOW_GUTTER = 16;

export default function AppCatalogueCapacitor({
  navigationButtons,
  selectedVideos,
  homeVideos,
  suggestedVideos,
  allVideos,
  selectedNav,
}: AppCatalogueProps) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [cardHeight, setCardHeight] = useState(0);

  const cardWidth = cardHeight > 0 ? cardHeight * CARD_ASPECT : 0;
  const slideStyle = {
    width: cardWidth || 280,
    height: "100%" as const,
    boxSizing: "border-box" as const,
    paddingTop: SHADOW_GUTTER,
    paddingBottom: SHADOW_GUTTER,
    display: "flex",
    alignItems: "center",
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateSize = () => {
      const swiperEl = track.querySelector(".swiper") as HTMLElement | null;
      const swiperHeight = swiperEl?.clientHeight || track.clientHeight;
      setCardHeight(Math.max(0, swiperHeight - SHADOW_GUTTER * 2));
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (cardHeight <= 0) return;
    swiperRef.current?.update();
  }, [cardHeight]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    swiper.slideTo(0, 0);
    swiper.update();
  }, [selectedNav, selectedVideos]);

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
    suggestedVideos.length === 0 &&
    allVideos.length === 0;

  return (
    <Stack
      ref={trackRef}
      sx={{
        width: "100%",
        height: "70%",
        minHeight: 0,
        py: 1,
        pb: "max(12px, env(safe-area-inset-bottom))",
        // pl: "max(-10px, env(safe-area-inset-left))",
        // pr: "max(12px, env(safe-area-inset-right))",
        "& .swiper": {
          width: "100%",
          height: "100%",
          overflow: "hidden",
        },
        "& .swiper-wrapper": {
          height: "100%",
          alignItems: "stretch",
        },
        "& .swiper-slide": {
          height: "100%",
          width: "auto",
          flexShrink: 0,
          overflow: "visible",
          boxSizing: "border-box",
        },
      }}
    >
      <Swiper
        key={selectedNav ?? "catalogue"}
        modules={[FreeMode]}
        slidesPerView="auto"
        spaceBetween={16}
        freeMode={{
          enabled: true,
          sticky: false,
          momentum: true,
          momentumBounce: false,
        }}
        resistanceRatio={0.65}
        watchOverflow
        observer
        observeParents
        observeSlideChildren
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiper.update();
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {isCatalogueLoading
          ? Array.from({ length: CARD_SKELETON_COUNT }, (_, index) => (
              <SwiperSlide key={`card-skeleton-${index}`} style={slideStyle}>
                <Stack
                  sx={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "white",
                    boxShadow: 3,
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
                <SwiperSlide key={item._id} style={slideStyle}>
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
                      borderRadius: 6,
                      boxShadow: 4,
                      cursor: "pointer",
                      bgcolor: "transparent",
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
                    <Box
                      sx={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                        borderRadius: 6,
                        overflow: "hidden",
                        bgcolor: "black",
                      }}
                    >
                    <Image
                      className="app-catalogue-capacitor-image"
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes={`${Math.round(cardWidth || 280)}px`}
                      style={{
                        objectFit: "cover",
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
                          pl: 8,
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
                    </Box>
                  </Stack>
                </SwiperSlide>
              );
            })}
      </Swiper>
    </Stack>
  );
}
