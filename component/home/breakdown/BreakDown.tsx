"use client";

import { IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { AppButton } from "@/component/ui/AppButton";
import BreakdownModal from "./component/BreakdownModal";
import { useState } from "react";
import SeactionHeader from "@/component/ui/SectionHeader";

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
  width: { xs: "100%", sm: "95%" },
  minHeight: { xs: 340, md: 430 },
  px: { xs: 0, md: 2 },
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
    width: { xs: "88%", md: "92%" },
    bgcolor: "#fff",
    borderRadius: { xs: 5, md: 7 },
    boxShadow: "0 12px 32px 10px rgba(0, 0, 0, 0.12)",
    gap: 2,
    pb: 2,
    "& img": {
      borderRadius: { xs: 5, md: 7 },
      transition: "transform 300ms ease",
    },
    "& .MuiIconButton-root": {
      transition: "transform 300ms ease",
    },
    "&:hover img": {
      transform: "scale(1.1)",
    },
    "&:hover .MuiIconButton-root": {
      transform: "scale(1.1)",
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
          pt: 0,
        }}
      >
        <SeactionHeader text={`Behind the scenes`} />

        <Stack direction="row" sx={cardStyle}>
          <Swiper
            modules={[Autoplay]}
            slidesPerView={3}
            centeredSlides
            autoplay={{ delay: 1500, disableOnInteraction: false }}
            loop
            speed={700}
            spaceBetween={16}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 3,
              },
            }}
            style={{
              width: "100%",
              height: "100%",
              paddingTop: 20,
              paddingBottom: 80,
            }}
          >
            {projectBreakDowns.map((item) => (
              <SwiperSlide key={item._id}>
                <Stack
                  className="breakdown-card"
                  onClick={() => onOpenBreakdownModal(item)}
                >
                  <Stack
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      borderRadius: { xs: "14px", md: "18px" },
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      gap: { xs: 1, md: 1.5 },
                      px: 1.5,
                    }}
                  >
                    <IconButton
                      sx={{
                        flexShrink: 0,
                        width: { xs: 42, md: 48, lg: 52 },
                        height: { xs: 42, md: 48, lg: 52 },
                        bgcolor: "secondary.main",
                        color: "#fff",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.16)",
                        "&:hover": { bgcolor: "secondary.main" },
                      }}
                    >
                      <PlayArrowRoundedIcon
                        sx={{
                          fontSize: { xs: 24, sm: 28, md: 32, lg: 36 },
                          display: "block",
                        }}
                      />
                    </IconButton>

                    <Stack sx={{ minWidth: 0, gap: 1 }}>
                      <Typography
                        component="p"
                        sx={{
                          fontSize: { xs: 12, md: 16 },
                          fontWeight: 800,
                          color: "primary.main",
                          fontFamily: "Bhel Puri",
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: 9, md: 12, lg: 14 },
                          height: { xs: 18, md: 30 },
                          color: "text.primary",
                          fontFamily: "Namecat",
                          lineHeight: 1.15,
                          textTransform: "uppercase",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.content} asdf asdf asdf asdf asdf asdf
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </SwiperSlide>
            ))}
          </Swiper>
        </Stack>
      </Stack>

      <BreakdownModal
        open={openBreakdownModal}
        onClose={onCloseBreakdownModal}
        selectedBreakdown={activeBreakdown}
      />
    </>
  );
};

export default BreakDown;
