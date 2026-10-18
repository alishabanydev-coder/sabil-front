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
const VERTICAL_INSET = 10;
const TITLE_BLOCK = 56;
const SIDE_INSET = 16;

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
    paddingTop: VERTICAL_INSET,
    paddingBottom: VERTICAL_INSET,
    display: "flex",
    alignItems: "center",
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateSize = () => {
      const swiperEl = track.querySelector(".swiper") as HTMLElement | null;
      const swiperStyles = swiperEl ? getComputedStyle(swiperEl) : null;
      const padTop = swiperStyles ? parseFloat(swiperStyles.paddingTop) || 0 : 0;
      const padBottom = swiperStyles
        ? parseFloat(swiperStyles.paddingBottom) || 0
        : 0;
      const swiperHeight =
        (swiperEl?.clientHeight || track.clientHeight) - padTop - padBottom;
      const titleEl = track.querySelector(
        "[data-catalogue-title]"
      ) as HTMLElement | null;
      const titleHeight = titleEl?.offsetHeight || TITLE_BLOCK;
      setCardHeight((current) => {
        const next = Math.max(
          0,
          Math.floor(swiperHeight - VERTICAL_INSET * 2 - titleHeight)
        );
        return Math.abs(current - next) < 2 ? current : next;
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(track);
    return () => observer.disconnect();
  }, [selectedVideos]);

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
        flex: 1,
        minHeight: 0,
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
        slidesOffsetBefore={SIDE_INSET}
        slidesOffsetAfter={SIDE_INSET}
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
                      // height: "100%",
                      width: "100%",
                      borderRadius: 6,
                      boxShadow: 3,
                      cursor: "pointer",
                      bgcolor: "white",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: (theme) =>
                          `0px 2px 10px 1px ${theme.palette.primary.main}`,
                        "& .app-catalogue-page-image": {
                          transition: "all 0.3s ease",
                          transform: "scale(1.1) rotate(3deg)",
                        },
                        "& .app-catalogue-page-play-button": {
                          transform: "translateY(0)",
                          scale: 1.1,
                          transition: "all 0.3s ease",
                        },
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16 / 9",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        className="app-catalogue-page-image"
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </Box>
                    <Stack
                      direction="row"
                      sx={{
                        width: "100%",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <Stack
                        sx={{
                          bgcolor: "#F9F9F9",
                          borderRadius: "0px 0px 24px 24px",
                          border: "3px solid #fff",
                          boxShadow: "0px 0px 15px 10px rgba(0, 0, 0, 0.5)",
                          width: "100%",
                          pl: 8,
                          pr: 1.5,
                          position: "relative",
                          pt: 0.4,
                          flexShrink: 0,
                        }}
                        data-catalogue-title
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
                            fontWeight: 700,
                            fontSize: 15,
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
                            fontWeight: 800,
                            fontSize: 12,
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
