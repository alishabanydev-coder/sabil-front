"use client";

import { useRef } from "react";
import { Stack } from "@mui/material";
import Image from "next/image";
import banner from "@/public/banner.png";
import Leftside from "./components/Leftside";
import Rightside from "./components/Rightside";
import Pagination from "./components/Pagination";

const Banner = () => {
  const bannerSwiperRef = useRef<any>(null);

  const handleNext = () => bannerSwiperRef.current?.slideNext();
  const handlePrev = () => bannerSwiperRef.current?.slidePrev();

  return (
    <Stack sx={{ position: "relative", width: "100%", aspectRatio: "16 / 6" }}>
      <Image src={banner} alt="some image" fill style={{ objectFit: "fill" }} />
      <Leftside />
      <Rightside onSwiperInit={(swiper) => (bannerSwiperRef.current = swiper)} />
      <Stack sx={{ position: "absolute", bottom: 0, right: "47%" }}>
        <Pagination onNext={handleNext} onPrev={handlePrev} />
      </Stack>
    </Stack>
  );
};

export default Banner;
