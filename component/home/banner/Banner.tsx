"use client";

import { useRef, useState } from "react";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import Leftside from "./components/Leftside";
import Rightside from "./components/Rightside";
import Pagination from "./components/Pagination";
import AboutUsModal from "./components/AboutUsModal";

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
    header: "Child-Sofe",
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
          bottom: "-9%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "auto",
          height: "auto",
          mx: "auto",
          bgcolor: "background.paper",
          border: (theme) => `4px solid ${theme.palette.secondary.main}`,
          py: 3,
          px: 5,
          borderRadius: 8,
        }}
      >
        {/* Item Stack */}
        <Stack
          sx={{
            flexDirection: "row",
            direction: "ltr",
            gap: 6,
          }}
        >
          {AdsBox.map((item) => (
            <Stack
              key={item.header}
              sx={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                "& p": {
                  fontFamily: "Namecat",
                  width: 180,
                  lineHeight: 1.2,
                  textDecoration: "none",
                },
                "& img": {
                  width: 95,
                  height: 95,
                  objectFit: "contain",
                  mb: 1
                },
              }}
            >
              <Image src={item.img} alt={item.header} width={90} height={90} />
              <Stack sx={{ gap: .7 }}>
                <Typography
                  sx={{
                    color: item.color,
                    fontSize: { xs: 10, sm: 12, md: 14, lg: 20, xl: 22 },
                    fontWeight: 700,
                    letterSpacing: 1.2,
                  }}
                >
                  {item.header}
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 } }}
                >
                  {item.body}
                </Typography>
              </Stack>
            </Stack>
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
