"use client";

import { Box, IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import MediaSectionImage from "@/public/Media section.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import panjatan from "@/public/panjatan.png";
import ramazan from "@/public/ramazan.png";
import rocketProgram from "@/public/rocket-program.png";
import ustad from "@/public/ustad.png";
import sceneProphetStory from "@/public/scene-prophet-story.png";
import sceneToons from "@/public/scene-toons.png";
import sceneYusufMaryam from "@/public/scene-yusuf-maryam.png";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

const slides = [
  { id: 1, name: "panjatan", image: panjatan },
  { id: 2, name: "ramazan", image: ramazan },
  { id: 3, name: "syawal", image: rocketProgram },
  { id: 4, name: "ustad", image: ustad },
  { id: 5, name: "prophet story", image: sceneProphetStory },
  { id: 6, name: "toons", image: sceneToons },
  { id: 7, name: "yusuf maryam", image: sceneYusufMaryam },
  { id: 8, name: "syawal", image: rocketProgram },
];

const WatchUs = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        pt: 14,
      }}
    >
      <Typography
        sx={{ fontSize: 36, fontWeight: "bold", color: "primary.main" }}
      >
        Watch Us
      </Typography>

      <Stack
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 7",
          mt: -8,
        }}
      >
        <Image
          src={MediaSectionImage}
          alt="watch us"
          fill
          style={{ objectFit: "cover" }}
        />
        <Stack
          sx={{
            position: "absolute",
            top: "30%",
            left: 0,
            width: "100%",
            height: "auto",
            ".watch-us-card": {
              position: "relative",
              transition: "transform 300ms ease, opacity 300ms ease",
              boxShadow: "0 4px 18px rgba(0,0,0,0.9)",
              borderRadius: "25px",
            },
            ".swiper-slide-active .watch-us-card": {
              transition: "transform 300ms ease, opacity 300ms ease",
              transitionDelay: "100ms",
              ".play-button-wrap": {
                position: "absolute",
                bottom: -28,
                right: "20%",
                width: 85,
                height: 85,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease",
                "& .MuiIconButton-root": {
                  color: "secondary.main",
                },
              },
              ".play-button-ring": {
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 76,
                height: 76,
                marginTop: "-38px",
                marginLeft: "-38px",
                borderRadius: "50%",
                bgcolor: "rgba(255, 255, 255, 0.48)",
                zIndex: 0,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              },
              ".play-button": {
                position: "relative",
                zIndex: 1,
                width: 60,
                height: 60,
                padding: 0,
                bgcolor: "#fff",
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.25)",
                  bgcolor: "#fff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                },
              },
            },
          }}
        >
          <Swiper
            modules={[Autoplay]}
            slidesPerView={4}
            loop
            centeredSlides
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            spaceBetween={30}
            style={{
              width: "100%",
              height: "100%",
              paddingBottom: 40,
              paddingTop: 40,
            }}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <Stack
                  className="watch-us-card"
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                  }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.name}
                    fill
                    style={{ objectFit: "cover", borderRadius: "25px" }}
                  />
                  <Box className="play-button-wrap">
                    <Box className="play-button-ring" />
                    <IconButton
                      className="play-button"
                      onClick={() => {
                        console.log("play");
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: 54 }} />
                    </IconButton>
                  </Box>
                </Stack>
              </SwiperSlide>
            ))}
          </Swiper>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WatchUs;
