"use client";

import { Box, Divider, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { AppButton } from "../ui/AppButton";
import { Fragment } from "react";

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
    header: "Total Donors",
    number: "2,568",
    img: "/total-donor.png",
  },
  {
    header: "Collected Donations",
    number: "20,849",
    img: "/hand-heart.png",
  },
  {
    header: "Goal donation",
    number: "500,573",
    img: "/sibl.png",
  },
  {
    header: "Total Projects",
    number: "10 +",
    img: "/folder.png",
  },
];

type AdItem = (typeof AdsBox)[number];

const AdCard = ({ item }: { item: AdItem }) => (
  <Stack
    sx={{
      direction: "ltr",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: { xs: 0.5, sm: 0.8, md: 1 },
      width: { xs: "100%", sm: "auto" },
      textAlign: "center",
      "& p": {
        fontFamily: "Namecat",
        width: { xs: 150, sm: 115, md: 140, lg: 160, xl: 200 },
        lineHeight: 1.2,
      },
      "& img": {
        width: { xs: 35, sm: 45, md: 58, lg: 72, xl: 85 },
        height: { xs: 35, sm: 45, md: 58, lg: 72, xl: 85 },
        objectFit: "contain",
      },
    }}
  >
    <Image src={item.img} alt={item.header} width={90} height={90} />
    <Stack sx={{ gap: { xs: 0.2, sm: 0.6 } }}>
      <Typography
        sx={{
          color: "#000",
          fontSize: { xs: 8, sm: 12, md: 14, lg: 16, xl: 18 },
          letterSpacing: 1.2,
        }}
      >
        {item.header}
      </Typography>
      <Typography
        sx={{
          color: "primary.main",
          fontFamily: "Arco",
          fontWeight: 700,
          fontSize: { xs: 14, sm: 20, md: 28, lg: 30, xl: 32 },
        }}
      >
        {item.number}
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
            xs: "-48%",
            sm: "-42%",
            md: "-45%",
            lg: "-36%",
            xl: "-26%",
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
          {AdsBox.map((item, index) => (
            <Fragment key={item.header}>
              {index > 0 ? (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor: "#ccc",
                    borderRightWidth: { sm: 1, md: 2 },
                    my: { sm: 0.5, md: 1 },
                  }}
                />
              ) : null}
              <AdCard item={item} />
            </Fragment>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DonationBanner;
