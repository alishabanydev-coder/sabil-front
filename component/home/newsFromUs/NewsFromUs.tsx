"use client";

import { useRef, useState } from "react";
import { Button, Modal, Stack, Typography } from "@mui/material";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import {
  Autoplay,
  Navigation,
  Pagination as SwiperPagination,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import news1 from "@/public/news1.png";
import Pagination from "../banner/components/Pagination";
import SeactionHeader from "@/component/ui/SectionHeader";
import ReactPlayer from "react-player";

type Slide = {
  id: number | string;
  title: string;
  image: string | StaticImageData;
  link: string;
  content?: string;
  blog: BlogDataItem;
};

type BlogDataItem = {
  _id: string;
  title?: string;
  images?: string;
  image?: string[];
  content?: string;
  videoUrl?: string;
};

type NewsFromUsProps = {
  blogData?: BlogDataItem[];
};

const style = {
  direction: "ltr",
  width: "min(92vw, 960px)",
  maxHeight: "90vh",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  px: { xs: 2, md: 3 },
  py: 2,
  gap: 1,
  overflowY: "auto",
};

export default function NewsFromUs({ blogData = [] }: NewsFromUsProps) {
  const newsSwiperRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogDataItem | null>(null);

  const onClose = () => setOpen(false);

  const onOpen = (blog: BlogDataItem) => {
    setOpen(true);
    setSelectedBlog(blog);
  };

  const slides: Slide[] =
    blogData.length > 0
      ? blogData
          .map((item) => ({
            id: item._id,
            title: item.title || "Untitled blog",
            content: item.content,
            blog: item,
            image:
              item.images ||
              (Array.isArray(item.image) ? item.image[0] : "") ||
              news1,
            link: `/news/${item._id}`,
          }))
          .filter((slide) => Boolean(slide.image))
      : [];

  const handleNext = () => newsSwiperRef.current?.slideNext();
  const handlePrev = () => newsSwiperRef.current?.slidePrev();

  const selectedBlogImages = Array.isArray(selectedBlog?.image)
    ? selectedBlog.image.filter((img) => typeof img === "string" && img.trim())
    : typeof selectedBlog?.images === "string" && selectedBlog.images.trim()
      ? [selectedBlog.images]
      : [];

  return (
    <Stack
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: { xs: 1, sm: 4 },
        mt: { xs: 3, sm: 8 },
      }}
    >
      <SeactionHeader text="news from us" />

      <Typography
        sx={{
          width: "60%",
          fontSize: { xs: 9, sm: 16 },
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
          loop
          slidesOffsetBefore={80}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          style={{ width: "100%", height: "100%", direction: "ltr" }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
              slidesOffsetBefore: 0,
            },
            610: {
              slidesPerView: 1.3,
              spaceBetween: 70,
              slidesOffsetBefore: 80,
            },
          }}
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
                    width: { xs: "60%", sm: "50%" },
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
                    py: 1,
                    "& a": {
                      fontSize: { xs: 8, sm: 12 },
                      fontFamily: "Namecat",
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      textAlign: "center",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "primary.main",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      width: "100%",
                      fontSize: { xs: 10, sm: 16 },
                      fontFamily: "Namecat",
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      textAlign: "start",
                      unicodeBidi: "plaintext",
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => onOpen(slide.blog)}
                    sx={{
                      fontFamily: "Namecat",
                      fontSize: { xs: 8, sm: 12 },
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      textAlign: "center",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "primary.main",
                      "&:hover": {
                        color: "secondary.main",
                      },
                    }}
                  >
                    Read More
                    <EastRoundedIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
                  </Button>
                </Stack>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
        <Stack
          sx={{
            position: "absolute",
            bottom: { xs: -50, sm: -70 },
            right: { xs: "36%", sm: "7%" },
          }}
        >
          <Pagination onNext={handlePrev} onPrev={handleNext} />
        </Stack>
      </Stack>

      <Modal open={open} onClose={onClose}>
        <Stack sx={style}>
          <Stack
            sx={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "black",
              flexShrink: 0,
              minHeight: 220,
              "& .swiper-pagination-bullet": {
                bgcolor: "grey.800",
                opacity: 1,
              },
              "& .swiper-pagination-bullet-active": {
                bgcolor: "primary.main",
                width: "10px",
                height: "10px",
              },
              "& .swiper-button-prev, & .swiper-button-next": {
                color: "primary.main",
              },
              "& .swiper-button-prev::after, & .swiper-button-next::after": {
                fontSize: "20px",
                fontWeight: 700,
              },
            }}
          >
            <Swiper
              modules={[Navigation, SwiperPagination]}
              style={{ width: "100%", height: "100%" }}
              navigation
              pagination={{ clickable: true }}
            >
              {selectedBlog?.videoUrl && (
                <SwiperSlide
                  key={selectedBlog?.videoUrl}
                  style={{ width: "100%", height: "100%" }}
                >
                  <ReactPlayer
                    src={selectedBlog?.videoUrl}
                    controls
                    width="100%"
                    height="100%"
                    playing={open}
                  />
                </SwiperSlide>
              )}
              {selectedBlogImages.map((image) => (
                <SwiperSlide key={image} style={{ height: "100%" }}>
                  <Stack
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100% !important",
                      minHeight: 280,
                    }}
                  >
                    <img
                      src={image}
                      alt={selectedBlog?.title || "Blog image"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Stack>
                </SwiperSlide>
              ))}
              {selectedBlogImages.length === 0 ? (
                <SwiperSlide>
                  <Stack
                    sx={{
                      width: "100%",
                      minHeight: 280,
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "grey.100",
                    }}
                  >
                    <Typography color="text.secondary">
                      No image available
                    </Typography>
                  </Stack>
                </SwiperSlide>
              ) : null}
            </Swiper>
          </Stack>
          <Typography
            sx={{ fontSize: 24, fontWeight: 700, color: "primary.main" }}
          >
            {selectedBlog?.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
              color: "text.primary",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {selectedBlog?.content}
          </Typography>
        </Stack>
      </Modal>
    </Stack>
  );
}
