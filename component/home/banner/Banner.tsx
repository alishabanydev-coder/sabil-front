"use client";

import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Leftside from "./components/Leftside";
import Rightside from "./components/Rightside";
import Pagination from "./components/Pagination";
import AboutUsModal from "./components/AboutUsModal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

type BannerData = {
  createdAt: string;
  homepageOrder: number;
  isActive: boolean;
  name: string;
  poster: string;
  showInHomepage: boolean;
  title: string;
  updatedAt: string;
  __v: number;
  _id: string;
};

type AboutUsPage = {
  title: string;
  message: string;
  videoUrl: string;
};

const AdsBox = [
  {
    header: "Scholor Guided",
    body: "cordent reviewed by islamic scholars",
    img: "/scholar-ad.png",
    color: "#3298f1",
  },
  {
    header: "Child-Safe",
    body: "ad age appropriate and secure",
    img: "/child-ad.png",
    color: "#e66803",
  },
  {
    header: "Family Focused",
    body: "bult to steonnghen families and values",
    img: "/family-ad.png",
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
        width: { xs: 60, sm: 50, md: 70, lg: 85, xl: 110 },
        height: { xs: 60, sm: 50, md: 70, lg: 85, xl: 110 },
        objectFit: "contain",
      },
    }}
  >
    <Image src={item.img} alt={item.header} width={90} height={90} />
    <Stack sx={{ gap: 0.6 }}>
      <Typography
        sx={{
          color: item.color,
          fontSize: { xs: 14, sm: 13, md: 16, lg: 18, xl: 22 },
          fontWeight: 700,
          letterSpacing: 1.2,
        }}
      >
        {item.header}
      </Typography>
      <Typography sx={{ fontSize: { xs: 13, sm: 12, md: 14, lg: 16, xl: 20 } }}>
        {item.body}
      </Typography>
    </Stack>
  </Stack>
);

const Banner = ({
  bannerData,
  aboutUs,
}: {
  bannerData: BannerData[];
  aboutUs: AboutUsPage | null;
}) => {
  const [openAboutUsModal, setOpenAboutUsModal] = useState(false);
  const isAboutUsPublished = Boolean(aboutUs);
  const onCloseAboutUsModal = () => setOpenAboutUsModal(false);
  const onOpenAboutUsModal = () => {
    if (!isAboutUsPublished) {
      return;
    }
    setOpenAboutUsModal(true);
  };

  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: { xs: "16 / 9", sm: "16 / 7.5" },
      }}
    >
      <Image
        src="/banner-background.png"
        alt="some image"
        fill
        style={{ objectFit: "fill" }}
      />
      <Leftside
        showAboutUsButton={isAboutUsPublished}
        onOpenAboutUsModal={onOpenAboutUsModal}
      />

      <Stack
        sx={{
          position: "absolute",
          bottom: { xs: "-35%", sm: "-15%", md: "-17%", lg: "-10%", xl: "-8%" },
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "80%", sm: "auto" },
          height: "auto",
          mx: "auto",
          bgcolor: "background.paper",
          border: (theme) => `4px solid ${theme.palette.secondary.main}`,
          p: { xs: 1.5, md: 3 },
          px: 4,
          borderRadius: { xs: 8, md: 12 },
        }}
      >
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            width: { xs: "100%" },
          }}
        >
          <Swiper slidesPerView={1}>
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

      {/* <Rightside
        onSwiperInit={(swiper) => (bannerSwiperRef.current = swiper)}
        bannerData={bannerData || []}
      /> */}

      {isAboutUsPublished ? (
        <AboutUsModal
          open={openAboutUsModal}
          onClose={onCloseAboutUsModal}
          aboutUs={aboutUs}
        />
      ) : null}
    </Stack>
  );
};

export default Banner;
