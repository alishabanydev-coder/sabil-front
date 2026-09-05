"use client";

import { useEffect, useRef } from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import type { VideoData } from "./navbarTypes";

const SLIDES_OFFSET_AFTER = {
  sm: 50,
  md: 85,
  lg: 85,
  xl: 90,
} as const;

type ChannelFeaturedRailProps = {
  videos: VideoData[];
};

export default function ChannelFeaturedRail({
  videos,
}: ChannelFeaturedRailProps) {
  const router = useRouter();
  const theme = useTheme();
  const nextElRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const isXl = useMediaQuery(theme.breakpoints.up("xl"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const slidesOffsetAfter = isXl
    ? SLIDES_OFFSET_AFTER.xl
    : isLg
    ? SLIDES_OFFSET_AFTER.lg
    : isMd
    ? SLIDES_OFFSET_AFTER.md
    : SLIDES_OFFSET_AFTER.sm;

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    swiper.params.slidesOffsetAfter = slidesOffsetAfter;
    swiper.update();
  }, [slidesOffsetAfter]);

  if (videos.length === 0) {
    return null;
  }

  //FIXME: fix this position of the whole thing cuz it should be upper and lower

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", sm: "flex" },
        width: "82%",
        mx: "auto",
        alignItems: "center",
        gap: { sm: 1.5, md: 2.5 },
        mt: { xs: -3, sm: -5, md: -25 },
        mb: { sm: 2, md: 3 },
        zIndex: 100,
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          gap: 1,
          flexShrink: 0,
          maxWidth: { sm: 100, md: 150 },
        }}
      >
        <Box
          sx={{
            width: { sm: 36, md: 48 },
            height: { sm: 36, md: 48 },
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: 2,
          }}
        >
          <StarRoundedIcon
            sx={{
              transform: "rotate(35deg)",
              color: "#f1d332",
              fontSize: { sm: 28, md: 36 },
            }}
          />
        </Box>
        <Typography
          sx={{
            color: "primary.main",
            fontFamily: "Namecat",
            fontWeight: 700,
            fontSize: { sm: 12, md: 18 },
            lineHeight: 1.15,
            letterSpacing: 0.5,
            textTransform: "lowercase",
          }}
        >
          featured on video
        </Typography>
      </Stack>

      <Box
        sx={{
          position: "relative",
          flex: 1,
          minWidth: 0,
          borderRadius: 8,
          overflow: "hidden",
          bgcolor: "primary.light",
          px: { sm: 1.5, md: 2 },
          py: { sm: 1, md: 1.25 },
          pr: { sm: 1, md: 0 },
          "& .swiper": {
            width: "100%",
            overflow: "hidden",
          },
          "& .swiper-slide": {
            width: "auto",
            height: "auto",
          },
        }}
      >
        <Swiper
          modules={[Navigation, FreeMode]}
          slidesPerView="auto"
          spaceBetween={14}
          slidesOffsetAfter={slidesOffsetAfter}
          navigation={{
            nextEl: nextElRef.current,
          }}
          onBeforeInit={(swiper) => {
            const navigation = swiper.params.navigation;
            if (navigation && typeof navigation !== "boolean") {
              navigation.nextEl = nextElRef.current;
            }
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {videos.map((video) => (
            <SwiperSlide key={video._id}>
              <Box
                onClick={() => router.push(`/app/watch/${video._id}`)}
                sx={{
                  position: "relative",
                  width: { sm: 140, md: 180, lg: 210 },
                  aspectRatio: "16 / 9",
                  borderRadius: 5,
                  overflow: "hidden",
                  bgcolor: "#fff",
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  boxShadow: 1,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="210px"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>

        <Box
          aria-hidden
          sx={{
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: { sm: 90, md: 140 },
            borderRadius: "0 32px 32px 0",
            background: (theme) =>
              `linear-gradient(to right, transparent 0%, ${theme.palette.primary.light} 40%, ${theme.palette.primary.light} 100%)`,
            zIndex: 4,
          }}
        />

        <Box
          ref={nextElRef}
          onClick={() => swiperRef.current?.slideNext()}
          sx={{
            position: "absolute",
            right: { sm: 14, md: 24 },
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            width: { sm: 34, md: 42 },
            height: { sm: 34, md: 42 },
            borderRadius: "50%",
            bgcolor: "#fff",
            border: (theme) => `2px solid ${theme.palette.primary.main}`,
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: 3,
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "translateY(-50%) scale(1.06)",
            },
          }}
        >
          <NavigateNextRoundedIcon sx={{ fontSize: { sm: 26, md: 32 } }} />
        </Box>
      </Box>
    </Stack>
  );
}
