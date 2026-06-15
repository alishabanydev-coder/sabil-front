"use client";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { IconButton, Stack } from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const projects = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  image: "/news1.png",
  alt: `project ${index + 1}`,
}));

const ProjectSwiper = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [navState, setNavState] = useState({ isBeginning: true, isEnd: false });

  const updateNavState = (swiper: SwiperType) => {
    setNavState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  };

  return (
    <Stack
      sx={{
        width: "100%",
        position: "relative",
        ".swiper-slide": {
          height: "auto",
        },
      }}
    >
      <Swiper
        slidesPerView={3}
        spaceBetween={10}
        style={{ width: "100%", direction: "ltr" }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 12 },
          600: { slidesPerView: 2, spaceBetween: 12 },
          900: { slidesPerView: 3, spaceBetween: 10 },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          updateNavState(swiper);
        }}
        onSlideChange={updateNavState}
        onResize={updateNavState}
        onBreakpoint={updateNavState}
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <Stack
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </Stack>
          </SwiperSlide>
        ))}
      </Swiper>

      <Stack
        direction="row"
        sx={{
          position: "absolute",
          inset: 0,
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          pointerEvents: "none",
        }}
      >
        <Stack sx={{ pointerEvents: "auto", zIndex: 100 }}>
          {!navState.isBeginning ? (
            <IconButton
              aria-label="Previous projects"
              onClick={() => swiperRef.current?.slidePrev()}
              sx={{
                bgcolor: "secondary.main",
                color: "warning.main",
                "&:hover": { bgcolor: "secondary.light" },
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
          ) : null}
        </Stack>

        <Stack sx={{ pointerEvents: "auto", zIndex: 100 }}>
          {!navState.isEnd ? (
            <IconButton
              aria-label="Next projects"
              onClick={() => swiperRef.current?.slideNext()}
              sx={{
                bgcolor: "secondary.main",
                color: "warning.main",
                "&:hover": { bgcolor: "secondary.light" },
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProjectSwiper;
