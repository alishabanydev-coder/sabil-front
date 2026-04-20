"use client";

import { alpha, Box, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "Fast Learning",
    description:
      "Interactive activities and modern tools that keep students engaged.",
  },
  {
    title: "Creative Thinking",
    description:
      "Hands-on projects that grow confidence and problem-solving skills.",
  },
  {
    title: "Future Ready",
    description:
      "Programs designed to prepare young minds for tomorrow's world.",
  },
];

const Rightside = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "0%",
        right: 0,
        width: "72%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "0px 0px 0px 1000px",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          clipPath: "polygon(1% 0%, 100% 0%, 100% 98%, 25.5% 89%)",
        }}
      >
        <Swiper
          modules={[Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          style={{ width: "100%", height: "100%" }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.title}>
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  px: { xs: 3, md: 6 },
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 460,
                    borderRadius: 4,
                    p: { xs: 2, md: 4 },
                    bgcolor: "rgba(255,255,255,0.16)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: 16, sm: 20, md: 28 },
                      fontWeight: 700,
                      color: "#fff",
                      mb: 1,
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: 12, sm: 14, md: 18 },
                      color: "rgba(255,255,255,0.95)",
                      lineHeight: 1.5,
                    }}
                  >
                    {slide.description}
                  </Typography>
                </Box>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
    </Box>
  );
};

export default Rightside;
