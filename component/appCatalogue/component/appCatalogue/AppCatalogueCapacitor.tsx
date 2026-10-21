"use client";

import { Skeleton, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import type { AppCatalogueProps } from "../navbarTypes";
import AppCatalogueCapacitorCard from "./component/AppCatalogueCapacitorCard";

const CARD_SKELETON_COUNT = 4;
const CARD_ASPECT = 16 / 9;
const VERTICAL_INSET = 8;
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
      const padTop = swiperStyles
        ? parseFloat(swiperStyles.paddingTop) || 0
        : 0;
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

  const isCatalogueLoading =
    navigationButtons.length === 0 &&
    homeVideos.length === 0 &&
    suggestedVideos.length === 0 &&
    allVideos.length === 0;

  return (
    <Stack
      ref={trackRef}
      sx={{
        position: "relative",
        width: "100%",
        flex: 1,
        minHeight: 0,
        "& .swiper": {
          width: "100%",
          height: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
          pb: "max(6px, env(safe-area-inset-bottom))",
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
          : selectedVideos.map((item) => (
              <SwiperSlide key={item._id} style={slideStyle}>
                <AppCatalogueCapacitorCard video={item} />
              </SwiperSlide>
            ))}
      </Swiper>
    </Stack>
  );
}
