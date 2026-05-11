"use client";

import { IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { PrimaryButton } from "@/component/ui/PrimaryButton";
import BreakdownModal from "./component/BreakdownModal";
import { useState } from "react";

type ProjectBreakDown = {
  _id: string;
  projectId: string;
  title: string;
  content: string;
  videoUrl?: string;
  thumbnail: string;
};

const cardStyle = {
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
    cursor: "default",
    direction: "ltr",
    width: "100%",
    maxWidth: 220,
    height: 230,
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
  ".play-button-wrap": {
    position: "absolute",
    bottom: -15,
    right: "0%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiIconButton-root": {
      color: "white",
    },
  },
  ".play-button": {
    bgcolor: "primary.main",
    borderRadius: "50%",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.9)",
  },
  ".swiper-slide-active .breakdown-card": {
    boxShadow: (theme) => `0px 3px 20px 1px ${theme.palette.primary.main}`,

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
    "& .play-button-wrap": {
      position: "absolute",
      bottom: -20,
      right: "0%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    ".play-button": {
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
};

const BreakDown = ({
  projectBreakDowns,
}: {
  projectBreakDowns: ProjectBreakDown[];
}) => {
  const [openBreakdownModal, setOpenBreakdownModal] = useState(false);
  const [activeBreakdown, setActiveBreakdown] =
    useState<ProjectBreakDown | null>(null);
  const onCloseBreakdownModal = () => setOpenBreakdownModal(false);
  const onOpenBreakdownModal = (breakdown: ProjectBreakDown) => {
    setActiveBreakdown(breakdown);
    setOpenBreakdownModal(true);
  };
  return (
    <>
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
        <Stack direction="row" sx={cardStyle}>
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
              <SwiperSlide key={item._id}>
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
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </Stack>
                  <Stack sx={{ gap: 1 }}>
                    <Typography
                      component="p"
                      sx={{
                        fontSize: { xs: 20, md: 22 },
                        fontWeight: "bold",
                        color: "primary.main",
                        textTransform: "uppercase",
                        lineHeight: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: { xs: 12, md: 16 },
                        color: "secondary.main",
                        lineHeight: 1.1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.content}
                    </Typography>
                  </Stack>

                  <Stack
                    className="play-button-wrap"
                    sx={{ position: "relative", width: "100%" }}
                  >
                    <IconButton
                      className="play-button"
                      onClick={() => onOpenBreakdownModal(item)}
                    >
                      <PlayArrowRoundedIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Stack>
                </Stack>
              </SwiperSlide>
            ))}
          </Swiper>
        </Stack>

        <Stack
          sx={{
            position: "absolute",
            bottom: "-8%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PrimaryButton
            sx={{
              fontFamily: "Namecat",
              fontSize: 22,
              letterSpacing: 2,
              width: 280,
            }}
          >
            Donate here
          </PrimaryButton>
        </Stack>
      </Stack>
      <BreakdownModal
        open={openBreakdownModal}
        onClose={onCloseBreakdownModal}
        videoUrl={activeBreakdown?.videoUrl}
        title={activeBreakdown?.title}
        description={activeBreakdown?.content}
      />
    </>
  );
};

export default BreakDown;
