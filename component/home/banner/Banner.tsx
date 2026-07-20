"use client";

import { useRef, useState } from "react";
import { Stack } from "@mui/material";
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

const Banner = ({
  bannerData,
  aboutUs,
}: {
  bannerData: BannerData[];
  aboutUs: AboutUsPage | null;
}) => {
  const bannerSwiperRef = useRef<any>(null);
  const [openAboutUsModal, setOpenAboutUsModal] = useState(false);
  const isAboutUsPublished = Boolean(aboutUs);
  const onCloseAboutUsModal = () => setOpenAboutUsModal(false);
  const onOpenAboutUsModal = () => {
    if (!isAboutUsPublished) {
      return;
    }
    setOpenAboutUsModal(true);
  };

  const handleNext = () => bannerSwiperRef.current?.slideNext();
  const handlePrev = () => bannerSwiperRef.current?.slidePrev();

  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: { xs: "16 / 8", sm: "16 / 6.5" },
      }}
    >
      <Image
        src="/banner.webp"
        alt="some image"
        fill
        style={{ objectFit: "fill" }}
      />
      <Leftside
        showAboutUsButton={isAboutUsPublished}
        onOpenAboutUsModal={onOpenAboutUsModal}
      />
      <Rightside
        onSwiperInit={(swiper) => (bannerSwiperRef.current = swiper)}
        bannerData={bannerData || []}
      />
      <Stack
        sx={{
          position: "absolute",
          bottom: { xs: "-12%", md: 0 },
          right: { xs: "30%", md: "47%" },
        }}
      >
        <Pagination onNext={handleNext} onPrev={handlePrev} />
      </Stack>

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
