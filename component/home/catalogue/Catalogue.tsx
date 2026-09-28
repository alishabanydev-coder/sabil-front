"use client";

import { useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { AppButton } from "@/component/ui/AppButton";
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
        aspectRatio: { xs: "16 / 9", sm: "16 / 9" },
        position: "relative",
        // mt: 5,
      }}
    >
      <Image
        src="/catalogue.webp"
        alt="catalogue"
        fill
        style={{ objectFit: "fill" }}
      />

      {/* Poseter Swiper */}
      <Box
        sx={{
          width: "74%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          clipPath:
            "polygon(75% 20%, 76% 20.8%, 77% 22%, 78% 24%, 85% 75%, 85% 77.1%, 84% 79.2%, 83% 80.1%, 81.5% 81%, 0% 89%, 0 12%, 73% 19.1%)",
          "& .swiper, & .swiper-wrapper, & .swiper-slide": {
            width: "100%",
            height: "100%",
          },
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
              <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src={catalogue.image}
                  alt={catalogue._id}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Stack
        sx={{
          position: "absolute",
          top: "4%",
          right: 0,
          width: { xs: "40%", lg: "39%" },
          height: "75%",
          gap: { xs: 1, sm: 3, md: 4, lg: 5, xl: 6 },
          clipPath:
            "polygon(100% 0%, 100% 100%, 7.5% 95%, 2.3% 62%, 11.3% 5%, 12.7% 1%, 19.5% -2%, 25.3% -3%, 30% -4%)",
        }}
      >
        <Stack
          sx={{
            width: "90%",
            height: "20%",
            minHeight: 0,
            alignItems: "center",
            justifyContent: "center",
            px: 0.5,
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
                justifyContent: "space-evenly",
              }}
            >
              {selectedProject?.characters.map((character, index) => (
                <Box
                  key={`${character.name}-${index}`}
                  component={motion.div}
                  animate={{
                    y: [0, index % 2 === 0 ? -6 : -4, 0],
                    rotate: [0, index % 2 === 0 ? 2.4 : -2.2, 0],
                    scale: 1,
                  }}
                  whileHover={{
                    scale: 1.08,
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
                    height: "100%",
                    aspectRatio: "1 / 1",
                    maxWidth: "28%",
                    cursor: "pointer",
                    transformOrigin: "center bottom",
                    flexShrink: 1,
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

        <Box
          sx={{
            width: "100%",
            height: "80%",
            minHeight: 0,
            overflow: "hidden",
            "& .swiper, & .swiper-wrapper, & .swiper-slide": {
              width: "100%",
              height: "100%",
            },
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
                    width: "88%",
                    height: "100%",
                    justifyContent: "start",
                    overflow: "hidden",
                    px: { xs: 1, sm: 1.5, md: 1 },
                    boxSizing: "border-box",
                  }}
                >
                  <Stack
                    sx={{
                      width: "100%",
                      maxHeight: "100%",
                      gap: { xs: 0, sm: 0.5 },
                      textAlign: "left",
                      overflow: "hidden",
                    }}
                  >
                    <Stack sx={{ gap: { xs: 0.5, sm: 1.5 }, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: { xs: 10, sm: 18, md: 22, lg: 35, xl: 42 },
                          fontWeight: 700,
                          color: "primary.main",
                          lineHeight: 1,
                          textTransform: "uppercase",
                          fontFamily: "Bhel Puri",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedProject?.title}
                      </Typography>
                      <Typography
                        sx={{
                          direction: "ltr",
                          fontSize: { xs: 8, sm: 12, md: 14, lg: 16, xl: 20 },
                          fontFamily: "Namecat",
                          fontWeight: 400,
                          width: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "#ff3f7a",
                          lineHeight: 1.1,
                          textTransform: "uppercase",
                          mb: { xs: 0.8, md: 2.2 },
                          whiteSpace: "nowrap",
                        }}
                      >
                        {catalogue.header}
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        fontSize: { xs: 6, sm: 11, md: 16, lg: 20, xl: 24 },
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
      </Stack>

      <AppButton
        sx={{
          fontFamily: "Namecat",
          fontSize: { xs: 7, sm: 12, md: 15, lg: 18, xl: 20 },
          px: { xs: 0.7, md: 2, lg: 2.5 },
          py: { xs: 0.4, md: 1, lg: 1.2 },
          letterSpacing: 2,
          position: "absolute",
          bottom: { xs: "12%", sm: "15%" },
          right: { xs: "7%", sm: "10%" },
        }}
      >
        LEARN MORE
      </AppButton>

      <Stack
        sx={{
          position: "absolute",
          bottom: { xs: "-5%", sm: "0%", md: "5%", lg: "5%", xl: "8%" },
          right: "40%",
        }}
      >
        <Pagination onNext={handleNext} onPrev={handlePrev} />
      </Stack>
    </Stack>
  );
};

export default Catalogue;
