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
import flyingGirl from "@/public/flying-girl.png";
import flyingBoy from "@/public/flying-boy.png";
import flyingLittleGirl from "@/public/flying-little-boy.png";

const slides = [
  {
    title: "Real Children",
    description: "in islamic lifeStyle",
    text: "Inspired by the teachings of the Ahlul Bayt(AS) and under the scientific supervision of seminary professors, Sebil Kids produces content that is both engaging and understandable for children, as well as profound, accurate, and in line with Islamic principles. This is a place where children feel seen, heard, and can find themselves in a mirror of Islamic values ​​and identity.",
    charecterImages: [flyingGirl, flyingBoy, flyingLittleGirl],
  },
  {
    title: "Quality Content",
    description: "in islamic lifeStyle",
    text: "Inspired by the teachings of the Ahlul Bayt(AS) and under the scientific supervision of as well as profound, accurate, and in line with Islamic principles. This is a place where children feel seen, heard, and can find themselves in a mirror of Islamic values ​​and identity.",
    charecterImages: [flyingBoy, flyingLittleGirl, flyingGirl],
  },
  {
    title: "Future Ready",
    description: "in islamic lifeStyle",
    text: "Inspired by the teachings rofessors, Sebil Kids, as well as profound, accurate, and in line with Islamic principles. This is a place where children feel seen, heard, and can find themselves in a mirror of Islamic values ​​and identity.",
    charecterImages: [flyingLittleGirl, flyingGirl, flyingBoy],
  },
];

const Catalogue = () => {
  const catalogueLeftSwiperRef = useRef<any>(null);
  const catalogueRightSwiperRef = useRef<any>(null);
  const lastSlideIndexRef = useRef(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

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
            {slides[activeSlideIndex].charecterImages.map((imageSrc, index) => (
              <Box
                key={`character-${index}`}
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
                  src={imageSrc}
                  alt={`${slides[activeSlideIndex].title} ${index + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>
            ))}
          </Stack>
        </AnimatePresence>
      </Stack>

      <Box
        sx={{
          width: "74%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          bgcolor: "#000",
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
            const totalSlides = slides.length;
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
          {slides.map((slide) => (
            <SwiperSlide key={slide.title}>
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  px: { xs: 3, md: 6 },
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 460,
                    borderRadius: 4,
                    p: { xs: 2, md: 4 },
                    bgcolor: "rgba(255,255,255,0.16)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: 16, sm: 20, md: 28 },
                      fontWeight: 700,
                      color: "#fff",
                      mb: 1,
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: 12, sm: 14, md: 18 },
                      color: "rgba(255,255,255,0.95)",
                      lineHeight: 1.5,
                    }}
                  >
                    {slide.description}
                  </Typography>
                </Box>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Box
        sx={{
          width: "40%",
          height: "100%",
          position: "absolute",
          top: 0,
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
          {slides.map((slide) => (
            <SwiperSlide key={slide.title}>
              <Stack
                sx={{
                  width: "100%",
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
                      }}
                    >
                      {slide.title}
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
                      {slide.description}
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
                    {slide.text}
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
