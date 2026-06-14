"use client";

import { useRef, useState } from "react";
import { Modal, Stack } from "@mui/material";
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

type DonationSettings = {
  name: string;
  link: string;
};

const Banner = ({
  bannerData,
  aboutUs,
  donation,
}: {
  bannerData: BannerData[];
  aboutUs: AboutUsPage | null;
  donation: DonationSettings | null;
}) => {
  const bannerSwiperRef = useRef<any>(null);
  const [openAboutUsModal, setOpenAboutUsModal] = useState(false);
  const onCloseAboutUsModal = () => setOpenAboutUsModal(false);
  const onOpenAboutUsModal = () => setOpenAboutUsModal(true);

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
      <Image src="/banner.png" alt="some image" fill style={{ objectFit: "fill" }} />
      <Leftside onOpenAboutUsModal={onOpenAboutUsModal} donation={donation} />
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

      <AboutUsModal
        open={openAboutUsModal}
        onClose={onCloseAboutUsModal}
        aboutUs={aboutUs}
      />
    </Stack>
  );
};

export default Banner;
