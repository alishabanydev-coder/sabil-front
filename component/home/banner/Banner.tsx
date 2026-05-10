"use client";

import { useRef } from "react";
import { Stack } from "@mui/material";
import Image from "next/image";
import banner from "@/public/banner.png";
import Leftside from "./components/Leftside";
import Rightside from "./components/Rightside";
import Pagination from "./components/Pagination";

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

const Banner = ({ bannerData }: { bannerData: BannerData[] }) => {
  const bannerSwiperRef = useRef<any>(null);

  const handleNext = () => bannerSwiperRef.current?.slideNext();
  const handlePrev = () => bannerSwiperRef.current?.slidePrev();

  return (
    <Stack
      sx={{ position: "relative", width: "100%", aspectRatio: "16 / 6.5" }}
    >
      <Image src={banner} alt="some image" fill style={{ objectFit: "fill" }} />
      <Leftside />
      <Rightside
        onSwiperInit={(swiper) => (bannerSwiperRef.current = swiper)}
        bannerData={bannerData || []}
      />
      <Stack sx={{ position: "absolute", bottom: 0, right: "47%" }}>
        <Pagination onNext={handleNext} onPrev={handlePrev} />
      </Stack>
    </Stack>
  );
};

export default Banner;
