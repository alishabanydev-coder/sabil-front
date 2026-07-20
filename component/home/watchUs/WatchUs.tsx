"use client";

import { Box, IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
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
  top: { xs: "18%", sm: "25%" },
  left: 0,
  width: "100%",
  height: "auto",
  ".watch-us-card": {
    position: "relative",
    transition: "transform 300ms ease, opacity 300ms ease",
    boxShadow: "0 4px 18px rgba(0,0,0,0.9)",
    borderRadius: "25px",
    scale: 0.9,
  },
  ".play-button-wrap": {
    display: "none",
  },
  ".swiper-slide-active .watch-us-card": {
    transitionDelay: "100ms",
    scale: 1,
    transition: "all 360ms ease, opacity 300ms ease",
    ".play-button-wrap": {
      position: "absolute",
      bottom: { xs: -28, sm: -28 },
      right: { xs: "15%", sm: "20%" },
      width: { xs: 65, sm: 85 },
      height: { xs: 65, sm: 85 },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // transition: "transform 0.3s ease",
      "& .MuiIconButton-root": {
        color: "secondary.main",
      },
    },
    ".play-button-ring": {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: { xs: 56, sm: 76 },
      height: { xs: 56, sm: 76 },
      marginTop: { xs: "-28px", sm: "-38px" },
      marginLeft: { xs: "-28px", sm: "-38px" },
      borderRadius: "50%",
      bgcolor: "rgba(255, 255, 255, 0.48)",
      zIndex: 0,
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      transition: "box-shadow 0.3s ease, transform 0.3s ease",
    },
    ".play-button": {
      position: "relative",
      zIndex: 1,
      width: { xs: 40, sm: 60 },
      height: { xs: 40, sm: 60 },
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
          gap: 1,
          pt: 14,
        }}
      >
        <SeactionHeader text="Watch Us" sx={{ zIndex: 100 }} />

        <Stack
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: { xs: "16 / 14", sm: "16 / 7" },
            mt: { xs: -8, sm: -5 },
          }}
        >
          <Image
            src="/Media section.webp"
            alt="watch us"
            fill
            style={{ objectFit: "cover" }}
          />
          <Stack sx={cardStyle}>
            <Swiper
              modules={[Autoplay]}
              slidesPerView={3.5}
              loop
              centeredSlides
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              spaceBetween={5}
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
                paddingBottom: 40,
                paddingTop: 40,
              }}
            >
              {videoData.map((slide) => (
                <SwiperSlide key={slide._id}>
                  <Stack
                    className="watch-us-card"
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 10",
                    }}
                  >
                    <Image
                      src={slide.thumbnail}
                      alt={slide.title}
                      fill
                      style={{ objectFit: "contain", borderRadius: "25px" }}
                    />
                    <Box className="play-button-wrap">
                      <Box className="play-button-ring" />
                      <IconButton
                        className="play-button"
                        onClick={() => onOpenWatchUsModal(slide)}
                      >
                        <PlayArrowRoundedIcon
                          sx={{ fontSize: { xs: 36, sm: 54 } }}
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
