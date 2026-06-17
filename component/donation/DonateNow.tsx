"use client";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { alpha, Avatar, IconButton, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import { useRef, useState } from "react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { useInView } from "@/component/donation/hooks/useInViewOnce";
import OdometerNumber from "./component/OdometerNumber";

const SQUARE_SIZE = 22;

const supporters = [
  {
    id: 1,
    name: "Sarah Ahmed",
    image: "/avatar1.png",
    comment:
      "Sabeel Kids changed how my children learn about Islam. We donate every month.",
  },
  {
    id: 2,
    name: "Omar Hassan",
    image: "/avatar2.png",
    comment:
      "Beautiful animation and meaningful stories. Proud to support this mission.",
  },
  {
    id: 3,
    name: "Fatima Ali",
    image: "/avatar3.png",
    comment:
      "Our family loves Al-Furqan. Donating helps keep this content free for everyone.",
  },
  {
    id: 4,
    name: "Yusuf Khan",
    image: "/avatar1.png",
    comment:
      "The quality of education and entertainment here is unmatched. Thank you, team!",
  },
  {
    id: 5,
    name: "Amina Noor",
    image: "/avatar2.png",
    comment:
      "I donated in honor of my parents. May this work reach every child who needs it.",
  },
];

const donateNowSquareDrift = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(${SQUARE_SIZE}px, ${SQUARE_SIZE}px, 0);
  }
`;

const cornerFadeGradient = (color: string) =>
  `radial-gradient(ellipse 60% 60% at 0% 0%, ${color} 0%, transparent 70%),
   radial-gradient(ellipse 60% 60% at 100% 0%, ${color} 0%, transparent 70%),
   radial-gradient(ellipse 60% 60% at 0% 100%, ${color} 0%, transparent 70%),
   radial-gradient(ellipse 60% 60% at 100% 100%, ${color} 0%, transparent 70%)`;

const PATTERN_CENTER_MASK =
  "radial-gradient(ellipse 55% 50% at 50% 50%, #000 0%, #000 32%, transparent 100%)";

const DonateNow = () => {
  const { ref, inView } = useInView();
  const swiperRef = useRef<SwiperType | null>(null);
  const [navState, setNavState] = useState({ isBeginning: true, isEnd: false });

  const updateNavState = (swiper: SwiperType) => {
    setNavState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  };

  return (
    <Stack
      ref={ref}
      sx={{ width: "100%", position: "relative", mt: 5, direction: "ltr" }}
    >
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: 16 / 9,
          overflow: "hidden",
          borderRadius: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 1,
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.25),
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 5,
            backgroundImage: (theme) =>
              cornerFadeGradient(alpha(theme.palette.primary.main, 0.5)),
            pointerEvents: "none",
          },
          "& .donate-now-bg": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "rotate(-10deg) scale(1.3)",
            filter: "brightness(0.7)",
          },
          "& .swiper": {
            position: "absolute",
            inset: 0,
            zIndex: 4,
            width: "100%",
            height: "100%",
          },
          "& .swiper-slide": {
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            pb: { xs: "5%", sm: "10%", md: "12%", lg: "14%" },
            px: { xs: 3, sm: 6, md: 10 },
            boxSizing: "border-box",
          },
        }}
      >
        <img className="donate-now-bg" src="/news2.png" alt="" aria-hidden />

        <Stack
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            overflow: "hidden",
            pointerEvents: "none",
            WebkitMaskImage: PATTERN_CENTER_MASK,
            maskImage: PATTERN_CENTER_MASK,
          }}
        >
          <Stack
            sx={{
              position: "absolute",
              top: -SQUARE_SIZE * 2,
              left: -SQUARE_SIZE * 2,
              width: `calc(100% + ${SQUARE_SIZE * 4}px)`,
              height: `calc(100% + ${SQUARE_SIZE * 4}px)`,
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
              `,
              backgroundSize: `${SQUARE_SIZE}px ${SQUARE_SIZE}px`,
              backgroundRepeat: "repeat",
              animation: `${donateNowSquareDrift} 3s linear infinite`,
              willChange: "transform",
            }}
          />
        </Stack>

        <Swiper
          modules={[EffectFade, Autoplay]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          speed={700}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            stopOnLastSlide: true,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            updateNavState(swiper);
          }}
          onSlideChange={updateNavState}
        >
          {supporters.map((supporter) => (
            <SwiperSlide key={supporter.id}>
              <Stack
                sx={{
                  width: "100%",
                  maxWidth: 640,
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1.5,
                }}
              >
                <Typography
                  component="p"
                  sx={{
                    fontSize: { xs: 11, sm: 14, md: 18 },
                    fontWeight: 500,
                    fontFamily: "Namecat",
                    color: "warning.main",
                    letterSpacing: 1.2,
                    lineHeight: 1.5,
                    textShadow: "0 2px 12px rgba(0, 0, 0, 0.45)",
                  }}
                >
                  &ldquo;{supporter.comment}&rdquo;
                </Typography>
                <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                  <Avatar
                    alt={supporter.name}
                    src={supporter.image}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography
                    component="p"
                    sx={{
                      fontSize: { xs: 9, sm: 12, md: 14 },
                      fontWeight: 700,
                      fontFamily: "Namecat",
                      color: "common.white",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    {supporter.name}
                  </Typography>
                </Stack>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>

        <Stack
          direction="row"
          sx={{
            position: "absolute",
            inset: 0,
            alignItems: "center",
            justifyContent: "space-between",
            px: 1,
            zIndex: 6,
            pointerEvents: "none",
          }}
        >
          <Stack sx={{ pointerEvents: "auto" }}>
            {!navState.isBeginning ? (
              <IconButton
                aria-label="Previous supporter comment"
                onClick={() => swiperRef.current?.slidePrev()}
                sx={{
                  bgcolor: "secondary.main",
                  color: "warning.main",
                  "&:hover": { bgcolor: "secondary.light" },
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>
            ) : null}
          </Stack>

          <Stack sx={{ pointerEvents: "auto" }}>
            {!navState.isEnd ? (
              <IconButton
                aria-label="Next supporter comment"
                onClick={() => swiperRef.current?.slideNext()}
                sx={{
                  bgcolor: "secondary.main",
                  color: "warning.main",
                  "&:hover": { bgcolor: "secondary.light" },
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            ) : null}
          </Stack>
        </Stack>
      </Stack>

      <Stack
        sx={{
          position: "absolute",
          top: { xs: "7%", sm: "12%", md: "18%", lg: "22%" },
          width: "100%",
          mx: "auto",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5, md: 2, lg: 3 },
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <Stack
          sx={{
            flexWrap: "wrap",
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            sx={{
              flexWrap: "wrap",
              gap: 0.7,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {supporters.map((sup) => (
              <Avatar key={sup.id} alt={sup.name} src={sup.image} />
            ))}
          </Stack>

          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: 10, sm: 16, md: 26 },
              fontWeight: 500,
              fontFamily: "Namecat",
              color: "warning.main",
              letterSpacing: 3,
              direction: "ltr",
              textAlign: "center",
            }}
          >
            join our community donors
            <OdometerNumber
              value={200}
              active={inView}
              sx={{
                fontSize: { xs: 10, sm: 16, md: 26 },
                fontWeight: 700,
                fontFamily: "Namecat",
                letterSpacing: 2,
                direction: "ltr",
                color: "warning.main",
              }}
            />
            +
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DonateNow;
