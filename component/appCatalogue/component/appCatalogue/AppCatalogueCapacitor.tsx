"use client";

import { IconButton, Skeleton, Stack } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import type { AppCatalogueProps } from "../navbarTypes";
import AppCatalogueCapacitorCard from "./component/AppCatalogueCapacitorCard";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { APP_GRADIENT } from "../../appGradient";

const CARD_SKELETON_COUNT = 4;
const CARD_ASPECT = 16 / 9;
const TOP_INSET = 7;
const BOTTOM_INSET = 12;
const SIDE_INSET = 98;

const boldIcon = {
  "& svg": {
    fontSize: 32,
    stroke: "currentColor",
    strokeWidth: 2,
  },
};

const IconBtnSX = {
  bgcolor: "secondary.main",
  color: "white",
  p: 1.2,
  border: "1px solid #fff",
  boxShadow: 3,
  "&:hover": {
    bgcolor: "secondary.light",
  },
  "& svg": {
    fontSize: 32,
  },
};

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

  const isCatalogueLoading =
    navigationButtons.length === 0 &&
    homeVideos.length === 0 &&
    suggestedVideos.length === 0 &&
    allVideos.length === 0;

  const cardWidth = cardHeight > 0 ? cardHeight * CARD_ASPECT : 0;
  const slideStyle = {
    width: cardWidth || 280,
    height: "100%" as const,
    boxSizing: "border-box" as const,
    paddingTop: TOP_INSET,
    paddingBottom: BOTTOM_INSET,
    display: "flex",
    alignItems: "center",
  };

  useLayoutEffect(() => {
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
      const footerEl = track.querySelector(
        "[data-catalogue-footer]"
      ) as HTMLElement | null;
      const footerHeight = footerEl ? footerEl.offsetHeight : 0;
      setCardHeight((current) => {
        const next = Math.max(
          0,
          Math.floor(swiperHeight - TOP_INSET - BOTTOM_INSET - footerHeight)
        );
        return Math.abs(current - next) < 2 ? current : next;
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(track);
    const firstFooter = track.querySelector("[data-catalogue-footer]");
    if (firstFooter) {
      observer.observe(firstFooter);
    }
    return () => observer.disconnect();
  }, [selectedVideos, isCatalogueLoading]);

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

  return (
    <Stack
      ref={trackRef}
      sx={{
        flexDirection: "row",
        position: "relative",
        width: "100%",
        height: "100%",
        flex: 1,
        minHeight: 0,
        "& .swiper": {
          width: "100%",
          height: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
          pb: "max(0px, env(safe-area-inset-bottom))",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.25) 56px, rgba(0,0,0,0.7) 110px, #000 160px, #000 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.25) 56px, rgba(0,0,0,0.7) 110px, #000 160px, #000 100%)",
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
      <Stack
        sx={{
          position: "absolute",
          left: 14,
          top: 7,
          zIndex: 100,
          width: 90,
          height: "100%",
          justifyContent: "space-start",
          gap: 1,
          alignItems: "center",
          my: "auto",
          overflow: "visible",
          pointerEvents: "none",
          "& > *": { pointerEvents: "auto" },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: -14,
            width: 180,
            zIndex: -1,
            pointerEvents: "none",
            backgroundImage: APP_GRADIENT,
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.18) 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.18) 70%, transparent 100%)",
          },
        }}
      >
        <IconButton sx={IconBtnSX}>
          <FavoriteRoundedIcon />
        </IconButton>
        <IconButton sx={{ ...IconBtnSX, ...boldIcon }}>
          <FilterListRoundedIcon />
        </IconButton>
        <IconButton sx={{ ...IconBtnSX, ...boldIcon }}>
          <KeyboardBackspaceRoundedIcon />
        </IconButton>
      </Stack>

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
