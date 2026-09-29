"use client";

import { Box, IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import WatchUsModal from "./component/WatchUsModal";
import { useState } from "react";
import SeactionHeader from "@/component/ui/SectionHeader";

type VideoData = {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  projectId: string;
  season: number;
  episode: number;
  showInHomepage: boolean;
  homepageOrder: number;
};

const cardStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  "& .swiper": {
    width: "100%",
    height: "100%",
    overflow: "visible",
    display: "flex",
    alignItems: "center",
  },
  "& .swiper-wrapper": {
    alignItems: "center",
  },
  "& .swiper-slide": {
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ".watch-us-card": {
    position: "relative",
    transition: "transform 300ms ease, opacity 300ms ease",
    boxShadow: "0 5px 32px 5px rgba(0,0,0,0.5)",
    borderRadius: { xs: "16px", sm: "25px" },
    overflow: "hidden",
    scale: 1.2,
  },
  ".play-button-wrap": {
    display: "none",
  },
  ".swiper-slide-active .watch-us-card": {
    transitionDelay: "100ms",
    transition: "all 360ms ease, opacity 300ms ease",
    ".play-button-wrap": {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: { xs: 40, sm: 54, md: 75 },
      height: { xs: 40, sm: 54, md: 75 },
      "& .MuiIconButton-root": {
        color: "secondary.main",
      },
    },
    ".play-button": {
      position: "relative",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 0,
      width: "100%",
      height: "100%",
      minWidth: 0,
      padding: 0,
      bgcolor: "#fff",
      borderRadius: "50%",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      transition: "transform 0.3s ease",
      "& .MuiSvgIcon-root": {
        display: "block",
      },
      "&:hover": {
        transform: "scale(1.1)",
        bgcolor: "#fff",
        boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
      },
    },
  },
};

const WatchUs = ({ videoData }: { videoData: VideoData[] }) => {
  const [openWatchUsModal, setOpenWatchUsModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const onCloseWatchUsModal = () => {
    setOpenWatchUsModal(false);
    setSelectedVideo(null);
  };
  const onOpenWatchUsModal = (video: VideoData) => {
    setOpenWatchUsModal(true);
    setSelectedVideo(video);
  };

  return (
    <>
      <Stack
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          gap: 1,
          pt: { xs: 4, sm: 12 },
        }}
      >
        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: { xs: "-5%", sm: "8%", md: "8%" },
            left: 0,
          }}
        >
          <SeactionHeader text="featured videos" sx={{ zIndex: 100 }} />
        </Stack>

        <Stack
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: { xs: "16 / 14", sm: "1600 / 700" },
            mt: { xs: -8, sm: -5 },
            overflow: "visible",
          }}
        >
          <Image
            src="/background-featrued-video.png"
            alt="watch us"
            fill
            style={{ objectFit: "cover" }}
          />
          <Stack sx={cardStyle}>
            <Swiper
              modules={[Autoplay, EffectCoverflow]}
              effect="coverflow"
              observer
              observeParents
              observeSlideChildren
              centeredSlides
              watchSlidesProgress
              slidesPerView={3.5}
              loop={videoData.length >= 5}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              coverflowEffect={{
                rotate: 0,
                stretch: "-15%",
                depth: 300,
                modifier: 1,
                slideShadows: false,
              }}
              onProgress={(swiper) => {
                swiper.slides.forEach((slideEl) => {
                  const progress =
                    (slideEl as HTMLElement & { progress?: number }).progress ??
                    0;
                  const opacity = Math.min(
                    Math.max(3 - Math.abs(progress), 0),
                    1
                  );
                  slideEl.style.opacity = String(opacity);
                });
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1.8,
                },
                610: {
                  slidesPerView: 3.5,
                },
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              {videoData.map((slide) => (
                <SwiperSlide key={slide._id}>
                  <Stack
                    className="watch-us-card"
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                    }}
                  >
                    <Image
                      src={slide.thumbnail}
                      alt={slide.title}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                    <Box className="play-button-wrap">
                      <IconButton
                        className="play-button"
                        onClick={() => onOpenWatchUsModal(slide)}
                      >
                        <PlayArrowRoundedIcon
                          sx={{ fontSize: { xs: 36, sm: 48, md: 64 } }}
                        />
                      </IconButton>
                    </Box>
                  </Stack>
                </SwiperSlide>
              ))}
            </Swiper>
          </Stack>
        </Stack>
      </Stack>

      <WatchUsModal
        open={openWatchUsModal}
        onClose={onCloseWatchUsModal}
        selectedVideo={selectedVideo}
      />
    </>
  );
};

export default WatchUs;
