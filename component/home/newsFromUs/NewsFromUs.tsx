"use client";

import { useRef } from "react";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import news1 from "@/public/news1.png";
import news2 from "@/public/news2.png";
import Pagination from "../banner/components/Pagination";

type Slide = {
  id: number | string;
  title: string;
  image: string | StaticImageData;
  link: string;
};

type BlogDataItem = {
  _id: string;
  title?: string;
  images?: string;
  image?: string[];
};

type NewsFromUsProps = {
  blogData?: BlogDataItem[];
};

const fallbackSlides: Slide[] = [
  {
    id: 1,
    title: "I really can't believe this animation was made by an Iranian team!",
    image: news1,
    link: "/news/news1",
  },
  {
    id: 2,
    title:
      "Sabeel Kids is taking part in the 1st International Animation Festival",
    image: news2,
    link: "/news/news2",
  },
  {
    id: 3,
    title:
      "Flying to Rome, Italy to take part in the 1st International Animation Festival",
    image: news1,
    link: "/news/news3",
  },
  {
    id: 4,
    title:
      "The first international animation festival in Iran will be held in the city of Tehran",
    image: news2,
    link: "/news/news4",
  },
  {
    id: 5,
    title:
      "The first international animation festival in Iran will be held in the city of Tehran in 2026",
    image: news1,
    link: "/news/news5",
  },
];

export default function NewsFromUs({ blogData = [] }: NewsFromUsProps) {
  const newsSwiperRef = useRef<any>(null);
  const slides: Slide[] =
    blogData.length > 0
      ? blogData
          .map((item) => ({
            id: item._id,
            title: item.title || "Untitled blog",
            image: item.images || (Array.isArray(item.image) ? item.image[0] : "") || news1,
            link: `/news/${item._id}`,
          }))
          .filter((slide) => Boolean(slide.image))
      : fallbackSlides;

  const handleNext = () => newsSwiperRef.current?.slideNext();
  const handlePrev = () => newsSwiperRef.current?.slidePrev();

  return (
    <Stack
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        pt: 10,
      }}
    >
      <Typography
        sx={{
          fontSize: 36,
          fontWeight: "bold",
          color: "primary.main",
          textTransform: "uppercase",
        }}
      >
        news from us
      </Typography>

      <Typography
        sx={{
          width: "60%",
          fontSize: 16,
          color: "success.main",
          fontFamily: "Namecat",
          textTransform: "uppercase",
          unicodeBidi: "plaintext",
          letterSpacing: 1.2,
          textAlign: "center",
        }}
      >
        you can follow us by reciving news from sabeel kids about animation
        production activities. seminars and other developments that our
        supporters participates in.
      </Typography>

      <Stack
        direction={"row"}
        sx={{
          width: "100%",
          position: "relative",
          ".swiper-slide": {
            height: "auto",
          },
        }}
      >
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => (newsSwiperRef.current = swiper)}
          slidesPerView={1.3}
          loop
          spaceBetween={60}
          slidesOffsetBefore={80}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          style={{ width: "100%", height: "100%", direction: "ltr" }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <Stack
                direction={"row"}
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack
                  sx={{
                    position: "relative",
                    width: "50%",
                    aspectRatio: "16 / 9",
                    ".news-from-us-image": {
                      objectFit: "cover",
                      borderRadius: "30px",
                      transform: "perspective(800px) rotateY(12deg)",
                      scale: 0.92,
                      transition: "all .3s ease-in",
                      opacity: 0.8,
                      "&:after": {
                        background:
                          "linear-gradient(90deg, rgba(255, 255, 255, 0.20), transparent 75%, rgba(0, 0, 0, 0.25))",
                      },
                    },
                  }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="news-from-us-image"
                  />
                </Stack>

                <Stack
                  sx={{
                    width: "50%",
                    alignSelf: "stretch",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 5,
                  }}
                >
                  <Typography
                    sx={{
                      width: "100%",
                      fontSize: 16,
                      fontFamily: "Namecat",
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      textAlign: "start",
                      unicodeBidi: "plaintext",
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Link
                    href={slide.link}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      fontFamily: "Namecat",
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      textAlign: "center",
                      textDecoration: "none",
                      color: "#000",
                    }}
                  >
                    Read More
                    <EastRoundedIcon sx={{ fontSize: 22 }} />
                  </Link>
                </Stack>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
        <Stack sx={{ position: "absolute", bottom: -70, right: "7%" }}>
          <Pagination onNext={handleNext} onPrev={handlePrev} />
        </Stack>
      </Stack>
    </Stack>
  );
}
