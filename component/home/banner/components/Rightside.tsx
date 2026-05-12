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
        width: "72%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "0px 0px 0px 1000px",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 98%, 25.5% 89%)",
        }}
      >
        <Swiper
          // modules={[Autoplay]}
          onSwiper={onSwiperInit}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
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
