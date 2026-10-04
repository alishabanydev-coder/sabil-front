"use client";

import { Box, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

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

type RightsideProps = {
  onSwiperInit?: (swiper: any) => void;
  bannerData: BannerData[];
};

const Rightside = ({ onSwiperInit, bannerData }: RightsideProps) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "0%",
        right: 0,
        width: "71%",
        height: "105%",
        overflow: "hidden",
        // borderRadius: "0px 0px 0px 1000px",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          clipPath:
            "polygon(0.8% 0%, 22% 69.4%, 22.7% 71.7%, 24.1% 74.1%, 26% 75.6%, 27.7% 77.1%, 29.4% 77.9%, 35.6% 78.7%, 43.5% 79.5%, 50.9% 80.3%, 57.8% 81.1%, 63.7% 81.7%, 67.8% 81.2%, 72.1% 80.4%, 75.1% 79.6%, 77.7% 78.8%, 79.9% 78%, 82% 77.25%, 85.8% 75.63%, 89.3% 74.1%, 94% 71.7%, 96.8% 70.1%, 100% 68.4%, 100% 0%)",
        }}
      >
        <Swiper
          modules={[Autoplay]}
          onSwiper={onSwiperInit}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={bannerData.length > 1}
          style={{ width: "100%", height: "100%" }}
        >
          {bannerData.map((bannerItem) => (
            <SwiperSlide key={bannerItem.title}>
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <Image
                    src={bannerItem.poster}
                    alt={bannerItem.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
    </Box>
  );
};

export default Rightside;
