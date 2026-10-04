"use client";

import { Box, Stack, Typography } from "@mui/material";
import { AppButton } from "@/component/ui/AppButton";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const WHY_CARDS = [
  {
    bg: "/red-why-card.webp",
    icon: "/red-heart.webp",
    color: "#FC4064",
    title: "Positive Impact",
    body: "building character, empathy and positivehabits that last a lifetime.",
  },
  {
    bg: "/blue-why-card.webp",
    icon: "/blue-star.webp",
    color: "#174ED5",
    title: "Quality for Children",
    body: "hight-quality animation and storytelling children love and parents trust",
  },
  {
    bg: "/green-why-card.webp",
    icon: "/green-leaf.webp",
    color: "#6FAA1F",
    title: "faith at the core",
    body: "every storyu is rooted in quran, sunnah and ahlulbayt teachings.",
  },
] as const;

const WhyCard = ({
  bg,
  icon,
  title,
  body,
  color,
}: {
  bg: string;
  icon: string;
  title: string;
  body: string;
  color: string;
}) => (
  <Stack
    sx={{
      width: { xs: 170, sm: 200, md: 250, lg: 290, xl: 320 },
      aspectRatio: 1.5,
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
      src={icon}
      alt=""
      width={70}
      height={70}
      style={{ width: "clamp(40px, 8vw, 70px)", height: "auto" }}
    />
    <Typography
      sx={{
        color: color,
        fontFamily: "Namecat",
        fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 22 },
        letterSpacing: 1.2,
        fontWeight: 700,
        mt: 1,
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontFamily: "Namecat",
        fontSize: { xs: 9, sm: 10, md: 10, lg: 12, xl: 14 },
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
            display: { xs: "block", md: "none" },
            width: "100%",
            mt: 2,
            "& .swiper": { width: "100%" },
            "& .swiper-slide": {
              height: "auto",
              display: "flex",
              justifyContent: "center",
            },
          }}
        >
          <Swiper
            slidesPerView={1}
            centeredSlides
            spaceBetween={12}
            modules={[Autoplay]}
            loop={true}
            autoplay={{ delay: 1500, disableOnInteraction: false }}
          >
            {WHY_CARDS.map((card) => (
              <SwiperSlide key={card.bg}>
                <WhyCard {...card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Stack
          direction="row"
          sx={{
            display: { xs: "none", md: "flex" },
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: { md: 4, lg: 5, xl: 6 },
            mt: 3,
            px: { md: 4, lg: 6 },
          }}
        >
          {WHY_CARDS.map((card) => (
            <WhyCard key={card.bg} {...card} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OurMission;
