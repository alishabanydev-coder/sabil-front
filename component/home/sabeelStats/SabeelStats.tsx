"use client";

import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const sabeeltems = [
  {
    number: "23t+",
    title: "projects",
    icon: "/kelaket.webp",
    color: "#000000",
  },
  {
    number: "1800+",
    title: "episode",
    icon: "/film.webp",
    color: "#0C3A97",
  },
  {
    number: "3500+",
    title: "videos",
    icon: "/blue-youtube.webp",
    color: "#0A79F2",
  },
  {
    number: "27M",
    title: "watch hours",
    icon: "/green-eye.webp",
    color: "#94C643",
  },
  {
    number: "350K",
    title: "subscribers",
    icon: "/yellow-comment.webp",
    color: "#F79B21",
  },
  {
    number: "5+",
    title: "year old journal",
    icon: "/blue-calendar.webp",
    color: "#00A8FF",
  },
  {
    number: "20+",
    title: "countries",
    icon: "/blue-world.webp",
    color: "#1161FF",
  },
];

const trustItems = [
  {
    title: "Guided by Scholars",
    icon: "/prupul-scholar.webp",
    description:
      "our content of shoped by a council of trusted Islamic scholars",
  },
  {
    title: "Produced in Qom",
    icon: "/green-mosque.webp",
    description:
      "proudly created in Qom the center of islamic learning and values",
  },
  {
    title: "Professional Team",
    icon: "/blue-team.webp",
    description: "animator, writers and educators dedicated ot excellence.",
  },
  {
    title: "Child-Safe Content",
    icon: "/pink-sheild.webp",
    description:
      "Ad-free, coppa-compliant and designed for a safe viewing experience.",
  },
];

const StatCard = ({ item }: { item: (typeof sabeeltems)[number] }) => (
  <Stack
    sx={{
      bgcolor: "#fff",
      px: { xs: 0, sm: 2, md: 2 },
      py: { xs: 1.5, sm: 1.5, md: 2, lg: 1 },
      width: { xs: 90, md: 100, lg: "100%" },
      mx: { xs: 0, lg: 1 },
      borderRadius: 3,
      alignItems: "center",
      justifyContent: "center",
      gap: { xs: 0.3, md: 0 },
      "& img": {
        width: { xs: 24, sm: 36, md: 54, lg: 64, xl: 75 },
        height: { xs: 16, sm: 28, md: 36, lg: 45, xl: 50 },
      },
    }}
  >
    <Image
      src={item.icon}
      alt={item.title}
      width={75}
      height={50}
      style={{ objectFit: "contain" }}
    />
    <Typography
      sx={{
        color: item.color,
        fontSize: { xs: 12, sm: 15, md: 20, lg: 32, xl: 48 },
        fontFamily: "Namecat",
        fontWeight: 700,
      }}
    >
      {item.number}
    </Typography>
    <Typography
      sx={{
        fontFamily: "Namecat",
        textAlign: "center",
        lineHeight: 1,
        color: "secondary.main",
        fontSize: { xs: 9, sm: 10, md: 12, lg: 15, xl: 22 },
      }}
    >
      {item.title}
    </Typography>
  </Stack>
);

const TrustCard = ({ item }: { item: (typeof trustItems)[number] }) => (
  <Stack
    sx={{
      gap: 1,
      width: { xs: 150, sm: "100%" },
      alignItems: "center",
      justifyContent: "center",
      boxShadow: 5,
      p: 2,
      borderRadius: 8,
      "& img": {
        width: { xs: 36, sm: 54, md: 72, lg: 110, xl: 120 },
        height: { xs: 36, sm: 54, md: 72, lg: 110, xl: 120 },
      },
    }}
  >
    <Image src={item.icon} alt={item.title} width={100} height={100} />
    <Typography
      sx={{
        fontSize: { xs: 12, sm: 14, md: 18, lg: 20, xl: 24 },
        textAlign: "center",
        color: "primary.main",
        fontWeight: 700,
        fontFamily: "Arco",
      }}
    >
      {item.title}
    </Typography>
    <Typography
      sx={{
        direction: "ltr",
        textAlign: "center",
        fontSize: { xs: 10, sm: 12, md: 14, lg: 18, xl: 19 },
        fontWeight: 400,
        fontFamily: "Namecat",
      }}
    >
      {item.description}
    </Typography>
  </Stack>
);

const SabeelStats = () => {
  return (
    <Stack sx={{ mt: { xs: 5, md: -2 }, gap: { xs: 3, md: 5 }, mb: 2 }}>
      <Stack
        sx={{
          direction: "ltr",
          width: "95%",
          mx: "auto",
          pt: { xs: 3, md: 5 },
          pb: { xs: 3, md: 6 },
          px: { xs: 1.5, sm: 3, md: 6 },
          borderRadius: 5,
          bgcolor: "primary.main",
          gap: { xs: 2, md: 4 },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 20, sm: 30, md: 36, lg: 40, xl: 45 },
            fontWeight: 700,
            letterSpacing: 1.4,
            lineHeight: 1,
            color: "#fff",
            textAlign: "center",
            fontFamily: "Namecat",
          }}
        >
          Sabeel in Number
        </Typography>
        <Box
          sx={{
            display: { xs: "block", lg: "none" },
            width: "100%",
            "& .swiper": { width: "100%", backgroundColor: "primary.main" },
            "& .swiper-slide": {
              width: "auto",
              height: "auto",
            },
          }}
        >
          <Swiper
            modules={[Autoplay]}
            loop={true}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
            }}
            slidesPerView="auto"
            spaceBetween={10}
            breakpoints={{
              600: {
                slidesPerView: "auto",
                centeredSlides: false,
                spaceBetween: 16,
              },
              700: {
                slidesPerView: "auto",
                centeredSlides: false,
                spaceBetween: 20,
              },
            }}
          >
            {sabeeltems.map((item) => (
              <SwiperSlide key={item.title}>
                <StatCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Stack
          sx={{
            display: { xs: "none", lg: "flex" },
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {sabeeltems.map((item) => (
            <StatCard key={item.title} item={item} />
          ))}
        </Stack>
      </Stack>
      <Stack sx={{ gap: { xs: 1, sm: 3, md: 5 } }}>
        <Typography
          sx={{
            fontSize: { xs: 20, sm: 30, md: 36, lg: 40, xl: 45 },
            fontWeight: 700,
            letterSpacing: 1.4,
            lineHeight: 1,
            color: "primary.main",
            textAlign: "center",
            fontFamily: "Bhel Puri",
          }}
        >
          Built on Trust
        </Typography>

        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            width: { xs: "100%", sm: "93%" },
            mx: "auto",
            "& .swiper": { width: "100%", py: 3, px: 0.8 },
            "& .swiper-slide": {
              width: "auto",
              height: "auto",
            },
          }}
        >
          <Swiper
            modules={[Autoplay]}
            rewind={true}
            // loop={true}
            autoplay={{ delay: 1500, disableOnInteraction: false }}
            slidesPerView="auto"
            spaceBetween={35}
            centeredSlides={true}
          >
            {trustItems.map((item) => (
              <SwiperSlide key={item.title}>
                <TrustCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Stack
          sx={{
            display: { xs: "none", sm: "flex" },
            width: "93%",
            mx: "auto",
            flexDirection: "row-reverse",
            gap: { sm: 3, lg: 5 },
          }}
        >
          {trustItems.map((item) => (
            <TrustCard key={item.title} item={item} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SabeelStats;
