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

type CatalogueData = {
  _id: string;
  projectId: string;
  header: string;
  body: string;
  image: string;
};

type ProjectData = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  characters: { name: string; image: string }[];
};

const Catalogue = ({
  catalogues,
  selectedProject,
}: {
  catalogues: CatalogueData[];
  selectedProject: ProjectData;
}) => {
  const catalogueLeftSwiperRef = useRef<any>(null);
  const catalogueRightSwiperRef = useRef<any>(null);
  const lastSlideIndexRef = useRef(0);
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
    <Stack
      sx={{
        width: "100%",
        aspectRatio: { xs: "16 / 9", sm: "16 / 8" },
        position: "relative",
        mt: 5,
      }}
    >
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
          top: { xs: "3%", sm: "0%", md: "0%", lg: "3%" },
          right: "3%",
          width: "42%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          zIndex: 3,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <Stack
            key={`characters-${selectedProject?._id ?? "none"}`}
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
            {selectedProject?.characters.map((character, index) => (
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
                  width: "28%",
                  aspectRatio: "1 / 1",
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
          }}
          onSlideChange={(swiper) => {
            const nextIndex = swiper.realIndex;
            const prevIndex = lastSlideIndexRef.current;
            const totalSlides = catalogues.length;
            if (totalSlides === 0) {
              return;
            }
            const movedNext = nextIndex === (prevIndex + 1) % totalSlides;

            setSlideDirection(movedNext ? 1 : -1);
            lastSlideIndexRef.current = nextIndex;
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          allowTouchMove={false}
          loop
          style={{ width: "100%", height: "100%" }}
        >
          {catalogues.map((catalogue) => (
            <SwiperSlide key={catalogue._id}>
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
                    src={catalogue.image}
                    alt={catalogue._id}
                    fill
                    style={{ objectFit: "cover" }}
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
            "polygon(100% 0%, 100% 100%, 7.5% 95%, 2.3% 62%, 11.3% 5%, 12.7% 1%, 19.5% -2%, 25.3% -3%, 30% -4%)",
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
          {catalogues.map((catalogue) => (
            <SwiperSlide key={catalogue._id}>
              <Stack
                sx={{
                  width: "80%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  px: { xs: 0, md: 3 },
                }}
              >
                <Stack
                  sx={{
                    width: "100%",
                    gap: { xs: 0, sm: 0.5 },
                    maxWidth: 360,
                    ml: "auto",
                    mr: { xs: 1.2, md: 0, lg: 8 },
                    textAlign: "left",
                  }}
                >
                  <Stack sx={{ gap: { xs: 0.5, sm: 1.5 } }}>
                    <Typography
                      sx={{
                        fontSize: { xs: 10, sm: 18, md: 22, lg: 28 },
                        fontWeight: 700,
                        color: "primary.main",
                        lineHeight: 1,
                        textTransform: "uppercase",
                        fontFamily: "Bhel Puri",
                      }}
                    >
                      {selectedProject?.title}
                    </Typography>
                    <Typography
                      sx={{
                        direction: "ltr",
                        fontSize: { xs: 8, sm: 12, md: 14, lg: 16 },
                        fontFamily: "Namecat",
                        fontWeight: 400,
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#ff3f7a",
                        lineHeight: 1.1,
                        textTransform: "uppercase",
                        mb: { xs: 1.5, md: 2.2 },
                      }}
                    >
                      {catalogue.header}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: { xs: 6, sm: 12, md: 16 },
                      fontFamily: "Namecat",
                      letterSpacing: 2,
                      fontWeight: 400,
                      color: "#fff",
                      lineHeight: 1.4,
                      textTransform: "uppercase",
                      whiteSpace: "pre-line",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 7,
                    }}
                  >
                    {catalogue.body}
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
          fontSize: { xs: 7, sm: 10, md: 20 },
          px: { xs: 0.7, md: 2 },
          py: { xs: 0.4, md: 1 },
          letterSpacing: 2,
          position: "absolute",
          bottom: { xs: "12%", sm: "15%" },
          right: { xs: "7%", sm: "10%" },
        }}
      >
        LEARN MORE
      </PrimaryButton>

      <Stack
        sx={{
          position: "absolute",
          bottom: { xs: "-5%", sm: "8%" },
          right: "40%",
        }}
      >
        <Pagination onNext={handleNext} onPrev={handlePrev} />
      </Stack>
    </Stack>
  );
};

export default Catalogue;
