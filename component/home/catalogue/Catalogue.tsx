"use client";

import { useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import catalogue from "@/public/catalogue.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { PrimaryButton } from "@/component/ui/PrimaryButton";
import Pagination from "../banner/components/Pagination";
import { AnimatePresence, motion } from "framer-motion";

type VideoData = {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  projectId: string;
  season: number;
  episode: number;
};

type ProjectData = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  characters: { name: string; image: string }[];
};

const Catalogue = ({
  addVideos,
  projectsData,
}: {
  addVideos: VideoData[];
  projectsData: ProjectData[];
}) => {
  const catalogueLeftSwiperRef = useRef<any>(null);
  const catalogueRightSwiperRef = useRef<any>(null);
  const lastSlideIndexRef = useRef(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const activeVideo = addVideos[activeSlideIndex];
  const activeProject = activeVideo
    ? projectsData.find((project) => project._id === activeVideo.projectId)
    : projectsData[activeSlideIndex];
  const activeCharacters = activeProject?.characters ?? [];

  const handleNext = () => {
    setSlideDirection(1);
    catalogueLeftSwiperRef.current?.slideNext();
    catalogueRightSwiperRef.current?.slideNext();
  };

  const handlePrev = () => {
    setSlideDirection(-1);
    catalogueLeftSwiperRef.current?.slidePrev();
    catalogueRightSwiperRef.current?.slidePrev();
  };

  return (
    <Stack sx={{ width: "100%", aspectRatio: "16 / 8", position: "relative" }}>
      <Image
        src={catalogue}
        alt="catalogue"
        fill
        style={{ objectFit: "fill" }}
      />

      {/* characters swiper */}
      <Stack
        sx={{
          position: "absolute",
          top: { xs: "5%", sm: "-3%", md: "-5%", lg: "5%" },
          right: "3%",
          width: "42%",
          height: 170,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          zIndex: 3,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <Stack
            key={`characters-${activeSlideIndex}`}
            component={motion.div}
            custom={slideDirection}
            variants={{
              initial: (direction: 1 | -1) => ({
                x: direction === 1 ? -80 : 80,
                opacity: 0,
              }),
              animate: { x: 0, opacity: 1 },
              exit: (direction: 1 | -1) => ({
                x: direction === 1 ? 80 : -80,
                opacity: 0,
              }),
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            sx={{
              width: "100%",
              height: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            {activeCharacters.map((character, index) => (
              <Box
                key={`${character.name}-${index}`}
                component={motion.div}
                animate={{
                  y: [0, index % 2 === 0 ? -10 : -8, 0],
                  rotate: [0, index % 2 === 0 ? 2.4 : -2.2, 0],
                  scale: 1,
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.18, ease: "easeOut" },
                }}
                transition={{
                  y: {
                    duration: 2.2 + index * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: 2.7 + index * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                sx={{
                  position: "relative",
                  width: "32%",
                  height: "100%",
                  cursor: "pointer",
                  transformOrigin: "center bottom",
                }}
              >
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>
            ))}
          </Stack>
        </AnimatePresence>
      </Stack>

      {/* Poseter Swiper */}
      <Box
        sx={{
          width: "74%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          clipPath:
            "polygon(75% 20%, 76% 20.8%, 77% 22%, 78% 24%, 85% 75%, 85% 77.1%, 84% 79.2%, 83% 80.1%, 81.5% 81%, 0 89%, 0 12%, 73% 19.1%)",
        }}
      >
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            catalogueLeftSwiperRef.current = swiper;
            lastSlideIndexRef.current = swiper.realIndex ?? 0;
            setActiveSlideIndex(swiper.realIndex ?? 0);
          }}
          onSlideChange={(swiper) => {
            const nextIndex = swiper.realIndex;
            const prevIndex = lastSlideIndexRef.current;
            const totalSlides = addVideos.length;
            if (totalSlides === 0) {
              return;
            }
            const movedNext = nextIndex === (prevIndex + 1) % totalSlides;

            setSlideDirection(movedNext ? 1 : -1);
            lastSlideIndexRef.current = nextIndex;
            setActiveSlideIndex(nextIndex);
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          allowTouchMove={false}
          loop
          style={{ width: "100%", height: "100%" }}
        >
          {addVideos.map((video) => (
            <SwiperSlide key={video._id}>
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  alignItems: "end",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "85%",
                    aspectRatio: "16 / 9.8",
                    borderRadius: 4,
                    position: "relative",
                  }}
                >
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Text Swiper */}
      <Box
        sx={{
          width: "40%",
          height: "65%",
          position: "absolute",
          top: "15%",
          right: 0,
          clipPath:
            "polygon(100% 8.8%, 100% 81.56%, 6.2% 72%, 2.2% 56%,  11.4% 17%, 12.7% 15%, 13.5% 14%, 14.3% 13.5%, 15% 13.2%, 16% 12.8%)",
        }}
      >
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => (catalogueRightSwiperRef.current = swiper)}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          allowTouchMove={false}
          loop
          style={{ width: "100%", height: "100%" }}
        >
          {addVideos.map((slide) => (
            <SwiperSlide key={slide._id}>
              <Stack
                sx={{
                  width: "80%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  px: { xs: 2, md: 3 },
                }}
              >
                <Stack
                  sx={{
                    width: "100%",
                    gap: 0.5,
                    maxWidth: 360,
                    ml: "auto",
                    mr: { xs: 1.2, md: 0, lg: 8 },
                    textAlign: "left",
                  }}
                >
                  <Stack sx={{ gap: 1.5 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: 14, sm: 18, md: 28 },
                        fontWeight: 700,
                        color: "primary.main",
                        lineHeight: 1,
                        textTransform: "uppercase",
                        fontFamily: "Bhel Puri",
                      }}
                    >
                      {
                        projectsData.find(
                          (project) => project._id === slide.projectId
                        )?.title
                      }
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 12, sm: 16, md: 16 },
                        fontFamily: "Namecat",
                        fontWeight: 400,
                        color: "#ff3f7a",
                        lineHeight: 1.1,
                        textTransform: "uppercase",
                        mb: { xs: 1.5, md: 2.2 },
                      }}
                    >
                      {slide.title}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: { xs: 10, sm: 12, md: 14 },
                      fontFamily: "Namecat",
                      letterSpacing: 2,
                      fontWeight: 400,
                      color: "#fff",
                      lineHeight: 1.55,
                      textTransform: "uppercase",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {slide.description}
                  </Typography>
                </Stack>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <PrimaryButton
        sx={{
          fontFamily: "Namecat",
          fontSize: 20,
          letterSpacing: 2,
          position: "absolute",
          bottom: "15%",
          right: "10%",
        }}
      >
        LEARN MORE
      </PrimaryButton>

      <Stack sx={{ position: "absolute", bottom: "8%", right: "40%" }}>
        <Pagination onNext={handleNext} onPrev={handlePrev} />
      </Stack>
    </Stack>
  );
};

export default Catalogue;
