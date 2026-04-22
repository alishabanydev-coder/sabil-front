"use client";

import { IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import sceneYusufMaryam from "@/public/scene-yusuf-maryam.png";
import sceneProphetStory from "@/public/scene-prophet-story.png";
import sceneToons from "@/public/scene-toons.png";
import { PrimaryButton } from "@/component/ui/PrimaryButton";

const projectBreakDowns = [
  {
    id: 1,
    name: "yusuf Aur Maryam",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    image: sceneYusufMaryam,
  },
  {
    id: 2,
    name: "Sabeel Kids",
    description:
      "Lorem  sit amet consectetur adipisicing elit. Quisquam, quos.",
    image: sceneProphetStory,
  },
  {
    id: 3,
    name: "Story Book",
    description: "Lorem ipsum dolor  adipisicing elit. Quisquam, quos.",
    image: sceneToons,
  },
  {
    id: 4,
    name: "Story Prophet",
    description: "Lorem ipsum dolor sit adipisicing elit. Quisquam, quos.",
    image: sceneProphetStory,
  },
  {
    id: 5,
    name: "toons",
    description: "Lorem adipisicing elit. Quisquam, quos.",
    image: sceneToons,
  },
];

const BreakDown = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        pt: 8,
      }}
    >
      <Typography
        sx={{
          fontSize: 36,
          fontWeight: "bold",
          color: "primary.main",
          textTransform: "uppercase",
          whiteSpace: "pre-line",
          textAlign: "center",
        }}
      >
        {`Project BreakDown \n for kids`}
      </Typography>
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          minHeight: { xs: 340, md: 430 },
          px: { xs: 1, md: 4 },
          overflowY: "visible",
          ".swiper": {
            width: "100%",
            height: "100%",
          },
          ".swiper-slide": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          ".breakdown-card": {
            position: "relative",
            width: "100%",
            maxWidth: 250,
            borderRadius: "30px",
            bgcolor: "#ececec",
            p: 2,
            pb: 5,
            textAlign: "center",
            transition: "transform 300ms ease, opacity 300ms ease",
            transform: "scale(0.9)",
            opacity: 0.72,
          },
          ".swiper-slide-prev .breakdown-card": {
            transform: "translateX(-40px) scale(0.95)",
            opacity: 0.92,
          },
          ".swiper-slide-next .breakdown-card": {
            transform: "translateX(40px) scale(0.95)",
            opacity: 0.92,
          },
          ".play-button": {
            position: "absolute",
            bottom: -10,
            right: "50%",
            bgcolor: "primary.main",
            borderRadius: "50%",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.9)",
          },
          ".swiper-slide-active .breakdown-card": {
            boxShadow: (theme) =>
              `0px 3px 20px 1px ${theme.palette.primary.main}`,

            transform: "scale(1.1) translateY(15px)",
            opacity: 1,
            bgcolor: "primary.main",
            transition: "transform 300ms ease, opacity 300ms ease",
            transitionDelay: "100ms",
            span: {
              color: "white",
            },
            P: {
              color: "success.main",
            },
            ".play-button": {
              position: "absolute",
              bottom: -20,
              right: "45%",
              width: 50,
              height: 50,
              bgcolor: "secondary.main",
              borderRadius: "50%",
              transform: "translateY(0)",
              transition: "transform 300ms ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0px 2px 7px rgba(0, 0, 0, 0.9)",
              },
            },
          },
        }}
      >
        <Swiper
          modules={[Autoplay]}
          slidesPerView={3}
          centeredSlides
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          speed={700}
          style={{
            width: "100%",
            height: "100%",
            paddingTop: 8,
            paddingBottom: 80,
          }}
        >
          {projectBreakDowns.map((item) => (
            <SwiperSlide key={item.id}>
              <Stack className="breakdown-card">
                <Stack
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: "20px",
                    overflow: "hidden",
                    mb: 1,
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Stack>
                <Stack sx={{ gap: 1 }}>
                  <Typography
                    component="p"
                    sx={{
                      fontSize: { xs: 20, md: 28 },
                      fontWeight: "bold",
                      color: "primary.main",
                      textTransform: "uppercase",
                      lineHeight: 1,
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: { xs: 12, md: 16 },
                      color: "secondary.main",
                      lineHeight: 1.1,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.description}
                  </Typography>
                </Stack>

                <IconButton
                  className="play-button"
                  onClick={() => {
                    console.log("play");
                  }}
                >
                  <PlayArrowRoundedIcon sx={{ color: "white" }} />
                </IconButton>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>

      <PrimaryButton
        sx={{
          fontFamily: "Namecat",
          fontSize: 20,
          letterSpacing: 2,
          position: "absolute",
          bottom: "-8%",
          right: "42.3%",
        }}
      >
        Donate here
      </PrimaryButton>
    </Stack>
  );
};

export default BreakDown;
