"use client";

import { Box, Stack, Typography } from "@mui/material";
import { AppButton } from "@/component/ui/AppButton";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const WHY_CARDS = [
  {
    bg: "/blue-why-card.png",
    title: "quality for children",
    body: "high-quality animation and storytelling children love and parents trust",
  },
  {
    bg: "/green-why-card.png",
    title: "stories that teach",
    body: "authentic islamic stories that inspire faith and build character",
  },
  {
    bg: "/red-why-card.png",
    title: "families we serve",
    body: "joyful content that brings families closer and builds a better tomorrow",
  },
] as const;

const WhyCard = ({
  bg,
  title,
  body,
}: {
  bg: string;
  title: string;
  body: string;
}) => (
  <Stack
    sx={{
      width: "100%",
      height: "100%",
      minHeight: { xs: 220, sm: 200, md: 240, lg: 280, xl: 320 },
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      px: { xs: 2.5, sm: 2, md: 2.5, lg: 3 },
      py: { xs: 2, md: 2.5 },
      backgroundImage: `url(${bg})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "100% 100%",
    }}
  >
    <Image
      src="/blue-star.png"
      alt=""
      width={70}
      height={70}
      style={{ width: "clamp(40px, 8vw, 70px)", height: "auto" }}
    />
    <Typography
      sx={{
        fontFamily: "Namecat",
        fontSize: { xs: 14, sm: 12, md: 16, lg: 18, xl: 22 },
        fontWeight: 700,
        mt: 1,
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontFamily: "Namecat",
        fontSize: { xs: 11, sm: 10, md: 12, lg: 14, xl: 16 },
        fontWeight: 100,
        mt: 0.5,
      }}
    >
      {body}
    </Typography>
  </Stack>
);

const OurMission = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        mt: { xs: 5, sm: 1, md: 8, lg: 5, xl: 4 },
        direction: "ltr",
      }}
    >
      <Stack sx={{ width: "100%" }}>
        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AppButton
            bgColor="#fd4c68"
            borderColor="#e61818"
            textColor="white"
            shadow="soft"
            sx={{
              px: { xs: 3.5, sm: 4, md: 4, lg: 5, xl: 6 },
              py: { xs: 0.5, sm: 0.5, md: 0.2, lg: 0.3, xl: 0.4 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
                letterSpacing: 1.4,
                fontWeight: 100,
                fontFamily: "Namecat",
                textAlign: "center",
              }}
            >
              Our Mission
            </Typography>
          </AppButton>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mt: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 25, md: 38, lg: 45, xl: 54 },
              fontWeight: "bold",
              color: "primary.main",
              fontFamily: "Bhel Puri",
              whiteSpace: "pre-line",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            Why We Exist
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 12, sm: 14, md: 18, lg: 20, xl: 24 },
              width: { xs: "80%", sm: "80%", md: "50%", lg: "45%", xl: "45%" },
              fontWeight: 100,
              fontFamily: "Namecat",
              textAlign: "center",
            }}
          >
            to nurture young hearts and mind with authentic islamic stories that
            teach, inspire and build a better tomorrow.
          </Typography>
        </Stack>

        <Box
          sx={{
            width: "100%",
            mt: { xs: 2, md: 3 },
            px: { xs: 0, sm: 2, md: 4, lg: 6 },
            "& .swiper": { width: "100%" },
            "& .swiper-slide": { height: "auto" },
          }}
        >
          <Swiper
            slidesPerView={1.25}
            centeredSlides
            spaceBetween={12}
            breakpoints={{
              600: {
                slidesPerView: 3,
                centeredSlides: false,
                spaceBetween: 16,
              },
              900: {
                slidesPerView: 3,
                centeredSlides: false,
                spaceBetween: 24,
              },
            }}
          >
            {WHY_CARDS.map((card) => (
              <SwiperSlide key={card.bg}>
                <WhyCard {...card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Stack>
    </Stack>
  );
};

export default OurMission;
