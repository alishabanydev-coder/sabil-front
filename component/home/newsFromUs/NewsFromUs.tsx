"use client";

import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import SeactionHeader from "@/component/ui/SectionHeader";
import NewsFromUsModal from "./component/NewsFromUsModal";

const DEFAULT_NEWS_IMAGE = "/news1.webp";

type Slide = {
  id: number | string;
  title: string;
  image: string;
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

export default function NewsFromUs({ blogData = [] }: NewsFromUsProps) {
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
              DEFAULT_NEWS_IMAGE,
            link: `/news/${item._id}`,
          }))
          .filter((slide) => Boolean(slide.image))
      : [];

  const previewSlides = slides.slice(0, 3);

  console.log(slides);

  return (
    <Stack
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: { xs: 1, sm: 4 },
        mt: { xs: 3, sm: 8 },
        direction: "ltr",
      }}
    >
      <SeactionHeader
        text="news from us"
        sx={{
          width: "74%",
          textAlign: "start",
          fontFamily: "Namecat",
          fontSize: { xs: 22, sm: 30, md: 36, lg: 32, xl: 36 },
        }}
      />

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
        <Stack
          sx={{
            width: "93%",
            flexDirection: { xs: "column", md: "row" },
            mx: "auto",
            gap: 2,
          }}
        >
          {/* FIXME: add the xs part to this and make it work */}

          <Stack
            sx={{
              flex: 1,
              minWidth: 0,
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            {previewSlides.map((slide) => (
              <Stack
                key={slide.id}
                onClick={() => onOpen(slide.blog)}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: { xs: 0.5, md: 1 },
                  boxShadow: 5,
                  borderRadius: 5,
                  gap: { xs: 1, md: 3 },
                  "&:hover": {
                    boxShadow: 10,
                    cursor: "pointer",
                    transform: "translateY(-5px)",
                  },
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                }}
              >
                <Stack
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 900px) 90vw, 30vw"
                    style={{ objectFit: "cover" }}
                  />
                </Stack>

                <Stack sx={{ px: { xs: 2, md: 3 } }}>
                  <Typography
                    sx={{
                      fontSize: { xs: 14, sm: 16, md: 18, lg: 20, xl: 22 },
                      fontFamily: "Namecat",
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      color: "primary.main",
                      textAlign: "start",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: 11, sm: 12, md: 14, lg: 16, xl: 18 },
                      fontFamily: "Namecat",
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      color: "text.primary",
                      textAlign: "start",
                      lineHeight: 1.3,
                      minHeight: { xs: "1.9em", md: "3.9em" },
                      maxWidth: "100%",
                      display: "-webkit-box",
                      WebkitLineClamp: { xs: 2, md: 3 },
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {slide.content} asdfk jas;lkdfj;laksjdf lkasjd;flkjas;ldkfj
                    powiejlk jweqpoiyuwepouiy poiyweroiquy weuyrqpoiupoi
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    width: "100%",
                    px: { xs: 1, md: 2 },
                    textAlign: "start",
                  }}
                >
                  <Button
                    variant="text"
                    disableRipple
                    sx={{
                      fontSize: { xs: 11, sm: 14, md: 16, lg: 18, xl: 20 },
                      width: "fit-content",
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      color: "primary.main",
                      textAlign: "start",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontFamily: "Namecat",
                      fontWeight: 100,
                      "& img": {
                        width: { xs: 20, md: 35 },
                        height: { xs: 10, md: 16 },
                      },
                    }}
                  >
                    Read More
                    <Image
                      src="/ping-arrow.png"
                      alt="pink-arrow"
                      width={35}
                      height={16}
                    />
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Stack>

          <Stack
            sx={{
              width: "auto",
              flexShrink: 0,
              alignSelf: "center",
              height: "fit-content",
            }}
          >
            <Button
              disableRipple
              sx={{
                height: "auto",
                minHeight: 0,
                whiteSpace: "nowrap",
                borderRadius: 8,
                bgcolor: "primary.main",
                color: "#fff",
                textTransform: "none",
                fontFamily: "Namecat",
                fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
                lineHeight: 1.15,
                boxShadow: 5,
                px: { xs: 2, md: 3 },
                py: { xs: 1.5, md: 2 },
                gap: 1,
                '& img':{
                  width: {xs: 20, md: 35},
                  height: {xs: 10, md: 16},
                },
                "&:hover": {
                  filter: "brightness(1.1)",
                },
              }}
            >
              View all Updates
              <Image
                src="/ping-arrow.png"
                alt="pink-arrow"
                width={36}
                height={20}
              />
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <NewsFromUsModal
        open={open}
        onClose={onClose}
        selectedBlog={selectedBlog}
      />
    </Stack>
  );
}
