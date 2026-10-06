"use client";

import { Box, Stack, Typography } from "@mui/material";
import Banner from "@/component/donation/Banner";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { AppButton } from "../ui/AppButton";

const CYAN_U = "#2ee6f0";
const COSINE_DENT = 0.1;
const COSINE_SAMPLES = 48;

function cosineRibbonPath(dent: number, samples: number) {
  const top: string[] = [];
  const bottom: string[] = [];

  for (let index = 0; index <= samples; index += 1) {
    const x = index / samples;
    const wave = dent * Math.pow(Math.sin(Math.PI * x), 0.9);
    top.push(`${x.toFixed(5)},${wave.toFixed(5)}`);
    bottom.push(`${x.toFixed(5)},${(1 - dent + wave).toFixed(5)}`);
  }

  return `M ${top.join(" L ")} L ${bottom.reverse().join(" L ")} Z`;
}

const COSINE_CLIP_PATH = cosineRibbonPath(COSINE_DENT, COSINE_SAMPLES);

const AdsBox = [
  {
    header: "Scholor Guided",
    body: "Content reviewed by Islamic scholars",
    img: "/scholar-ad.webp",
    color: "#3298f1",
  },
  {
    header: "Child-Safe",
    body: "Age-Appropriate and Secure Ads",
    img: "/child-ad.webp",
    color: "#e66803",
  },
  {
    header: "Family Focused",
    body: "Built to strengthen families and values",
    img: "/family-ad.webp",
    color: "#6bb435",
  },
];

type AdItem = (typeof AdsBox)[number];

const AdCard = ({ item }: { item: AdItem }) => (
  <Stack
    sx={{
      direction: "ltr",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: { xs: 2, sm: 2, md: 2 },
      width: { xs: "100%", sm: "auto" },
      "& p": {
        fontFamily: "Namecat",
        width: { xs: 150, sm: 115, md: 140, lg: 160, xl: 200 },
        lineHeight: 1.2,
      },
      "& img": {
        width: { xs: 45, sm: 50, md: 70, lg: 85, xl: 110 },
        height: { xs: 45, sm: 50, md: 70, lg: 85, xl: 110 },
        objectFit: "contain",
      },
    }}
  >
    <Image src={item.img} alt={item.header} width={90} height={90} />
    <Stack sx={{ gap: { xs: 0.2, sm: 0.6 } }}>
      <Typography
        sx={{
          color: item.color,
          fontSize: { xs: 12, sm: 13, md: 16, lg: 18, xl: 22 },
          fontWeight: 700,
          letterSpacing: 1.2,
        }}
      >
        {item.header}
      </Typography>
      <Typography sx={{ fontSize: { xs: 11, sm: 12, md: 14, lg: 16, xl: 20 } }}>
        {item.body}
      </Typography>
    </Stack>
  </Stack>
);

const DonationBanner = () => {
  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: { xs: "16 / 9", sm: "16 / 7.5" },
        // height: { xs: "25vh", sm: "30vh", md: "32vh", lg: "80vh", xl: "85vh" },
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        mt: -1,
      }}
    >
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath
            id="donation-banner-cosine-u"
            clipPathUnits="objectBoundingBox"
          >
            <path d={COSINE_CLIP_PATH} />
          </clipPath>
        </defs>
      </svg>

      <Stack
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: CYAN_U,
          overflow: "hidden",
          clipPath: "url(#donation-banner-cosine-u)",
          WebkitClipPath: "url(#donation-banner-cosine-u)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack sx={{ width: "100%", height: "100%", justifyContent: "center" }}>
          <Stack
            sx={{
              height: "90%",
              width: { xs: "32%", sm: "35%", md: "35%", lg: "32%", xl: "30%" },
              position: "absolute",
              top: "10%",
              left: "5%",
            }}
          >
            <Stack
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack
                sx={{
                  position: "absolute",
                  top: {
                    xs: "30%",
                    sm: "15%",
                    md: "16%",
                    lg: "15%",
                    xl: "18%",
                  },
                  left: "5%",
                  flexDirection: "column",
                  textAlign: "start",
                  direction: "ltr",
                  "& p": {
                    fontSize: { xs: 12, sm: 14, md: 24, lg: 34, xl: 38 },
                    fontFamily: "Arco",
                    lineHeight: 1.2,
                    whiteSpace: "pre-line",
                    letterSpacing: 1,
                    fontWeight: 100,
                  },
                  "& span": {
                    pt: { xs: 1, lg: 2 },
                    fontSize: { xs: 9, sm: 10, md: 14, lg: 18, xl: 20 },
                    fontFamily: "Namecat",
                    lineHeight: 1.2,
                    whiteSpace: "pre-line",
                    letterSpacing: 1,
                    fontWeight: 100,
                  },
                }}
              >
                <Typography color="primary">{`A TRUSTED\nGATEWAY TO`}</Typography>
                <Typography color={"secondary"}>{`ISLAMIC STORIES`}</Typography>
                <Typography color="primary">{`FOR CHILDREN`}</Typography>

                <Typography
                  component={"span"}
                  sx={{
                    display: { xs: "none", sm: "block" },
                    unicodeBidi: "isolate",
                  }}
                >
                  values-based We create sofe, joyful and animated content that
                  inspires faith, builds character and brings families closer.
                </Typography>
              </Stack>

              <Stack
                direction="row"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  gap: { xs: 1, lg: 2 },
                  position: "absolute",
                  bottom: {
                    xs: "28%",
                    sm: "32%",
                    md: "25%",
                    lg: "25%",
                    xl: "26%",
                  },
                  right: { xs: "8%", sm: "8%", md: "-8%" },
                  zIndex: 100,
                  justifyContent: "end",
                }}
              >
                <AppButton
                  tone="white"
                  shadow="soft"
                  sx={{
                    fontFamily: "Namecat",
                    height: { xs: 22, sm: 30, md: "auto" },
                    px: { xs: 0.7, sm: 1.2, md: 1.6, lg: 2 },
                    py: { xs: 0, sm: 0.3, md: 1, lg: 1.5 },
                    letterSpacing: 2,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: { xs: 0.5, md: 1 },
                    "& img": {
                      width: { xs: 10, sm: 12, md: 14, lg: 16, xl: 21 },
                      height: { xs: 10, sm: 12, md: 14, lg: 16, xl: 21 },
                      objectFit: "contain",
                    },
                    "& p": {
                      fontSize: { xs: 8, sm: 10, md: 16, lg: 18, xl: 18 },
                      fontFamily: "Namecat",
                      color: "secondary.main",
                      letterSpacing: 1,
                      lineHeight: 0.1,
                    },
                  }}
                >
                  <img src="/arrow-right.png" alt="arrow-right" />
                  <Typography>Join Our Mission</Typography>
                </AppButton>

                <AppButton
                  tone="primary"
                  shadow="soft"
                  sx={{
                    fontFamily: "Namecat",
                    height: { xs: 25, sm: 30, md: "auto" },
                    px: { xs: 0.7, sm: 1.2, md: 1.6, lg: 2 },
                    py: { xs: 0, sm: 0.3, md: 1, lg: 1.2 },
                    letterSpacing: 2,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: { xs: 0.5, md: 1 },
                    "& img": {
                      width: { xs: 10, sm: 12, md: 14, lg: 16, xl: 21 },
                      height: { xs: 10, sm: 12, md: 14, lg: 16, xl: 21 },
                      objectFit: "contain",
                    },
                    "& p": {
                      fontSize: { xs: 8, sm: 10, md: 16, lg: 18, xl: 18 },
                      fontFamily: "Namecat",
                      color: "#fff",
                      letterSpacing: 1,
                      lineHeight: 1.2,
                    },
                  }}
                >
                  <img src="/arrow-right.png" alt="arrow-right" />
                  <Typography>About Us</Typography>
                </AppButton>
              </Stack>
            </Stack>
          </Stack>
          <Stack></Stack>
        </Stack>
      </Stack>

      {/* stats bar */}
      <Stack
        sx={{
          position: "absolute",
          bottom: {
            xs: "-30%",
            sm: "-14.5%",
            md: "-25%",
            lg: "-16.2%",
            xl: "-14%",
          },
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "80%", sm: "auto" },
          height: "auto",
          mx: "auto",
          bgcolor: "background.paper",
          border: (theme) => `4px solid ${theme.palette.secondary.main}`,
          borderWidth: { xs: 2, sm: 3, md: 4, lg: 4, xl: 5 },
          p: { xs: 1.5, md: 3 },
          px: 4,
          borderRadius: { xs: 8, md: 12 },
          zIndex: 100,
        }}
      >
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            width: { xs: "100%" },
          }}
        >
          <Swiper
            slidesPerView={1}
            modules={[Autoplay]}
            autoplay={{ delay: 1500, disableOnInteraction: false }}
          >
            {AdsBox.map((item) => (
              <SwiperSlide key={item.header}>
                <AdCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Stack
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "row",
            direction: "ltr",
            gap: { sm: 2, md: 4, lg: 6, xl: 8 },
          }}
        >
          {AdsBox.map((item) => (
            <AdCard key={item.header} item={item} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DonationBanner;
