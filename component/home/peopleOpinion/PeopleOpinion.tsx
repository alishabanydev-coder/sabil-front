"use client";

import { Avatar, Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type CommentData = {
  _id: string;
  text: string;
  username: string;
  targetType: string;
  targetId: string | null;
};

const shouldShowTargetSubtitle = (targetType: string) =>
  !["general", "project"].includes(targetType);

type OpinionSwiper = SwiperType & { __opinionDuration?: number };

const applyOpinionMotion = (swiper: OpinionSwiper) => {
  if (swiper.destroyed || !swiper.el) return;

  const duration = swiper.__opinionDuration ?? 0;
  swiper.el.style.setProperty("--opinion-motion", `${duration}ms`);

  swiper.slides.forEach((slideEl) => {
    const progress =
      (slideEl as HTMLElement & { progress?: number }).progress ?? 0;
    const clamped = Math.max(-1, Math.min(1, progress));
    const distance = Math.abs(clamped);
    const isBehind = Math.abs(progress) > 1.4;
    const card = slideEl.querySelector<HTMLElement>(".people-opinion-card");
    if (!card) return;

    const rotate = clamped * -10;
    const scale = 1.15 - distance * 0.25;
    card.style.right = "auto";
    if (isBehind) {
      card.style.left = progress > 0 ? "-100px" : "180px";
    } else {
      card.style.left = progress > 0 ? "-10px" : "-50px";
    }
    card.style.transformOrigin =
      clamped < 0
        ? "left center"
        : clamped > 0
        ? "right center"
        : "center center";
    card.style.transform = `perspective(800px) rotateY(${rotate}deg) scale(${scale})`;

    const wash = card.querySelector<HTMLElement>(".opinion-wash");
    if (wash) wash.style.opacity = String(1 - distance);

    slideEl.style.zIndex = String(Math.round((1 - distance) * 5));
    card.classList.toggle("is-emphasized", distance < 0.45);
  });
};

const PeopleOpinion = ({ commentData }: { commentData: CommentData[] }) => {
  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 1.5,
        pt: 3,
        px: { xs: 2, sm: 4 },
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 12, sm: 14, md: 18, lg: 20, xl: 24 },
          color: "text.primary",
          fontFamily: "Namecat",
          textDecoration: "uppercase",
          letterSpacing: 1.2,
          direction: "ltr",
        }}
      >
        what families, education and supporters say.
      </Typography>


      {/* FIXME: add the xs part to this and make it work */}
      

      <Stack
        sx={{
          flexDirection: "row",
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "visible",
          justifyContent: "center",
          perspective: "1200px",
          ".swiper": {
            overflow: "visible",
            direction: "ltr",
            width: { xs: "65%", md: "100%" },
            mx: "auto",
          },
          ".swiper-wrapper": {
            alignItems: "center",
          },
          ".people-opinion-card": {
            position: "relative",
            width: "100%",
            height: "100%",
            transformOrigin: "center center",
            transitionProperty: "transform, transform-origin, left",
            transitionTimingFunction: "ease",
            transitionDuration: "var(--opinion-motion, 0ms)",
          },
          ".people-opinion-face": {
            boxShadow: "none",
            transitionProperty: "box-shadow",
            transitionTimingFunction: "ease",
            transitionDuration: "var(--opinion-motion, 0ms)",
          },
          ".people-opinion-card.is-emphasized .people-opinion-face": {
            boxShadow: "0 0 48px rgba(0, 0, 0, 0.28)",
          },
          ".opinion-wash": {
            transitionProperty: "opacity",
            transitionTimingFunction: "ease",
            transitionDuration: "var(--opinion-motion, 0ms)",
          },
          ".opinion-text, .opinion-role, .quote-icon": {
            transitionProperty: "color, opacity",
            transitionTimingFunction: "ease",
            transitionDuration: "var(--opinion-motion, 0ms)",
          },
          ".swiper-slide": {
            display: "flex",
            alignItems: "center",
            height: "auto",
          },
          ".quote-active": {
            opacity: 0,
          },
          ".people-opinion-card .opinion-text": {
            color: "#4A342C",
          },
          ".people-opinion-card .opinion-role": {
            color: "#6B534C",
          },
          ".people-opinion-card .opinion-meta": {
            justifyContent: "start",
            alignItems: "center",
            gap: 2,
            borderTop: "2px dotted",
            borderTopColor: "#FE9FA8",
            pt: 1,
            transitionProperty: "border-color",
            transitionTimingFunction: "ease",
            transitionDuration: "var(--opinion-motion, 0ms)",
          },
          ".people-opinion-card.is-emphasized .opinion-text, .people-opinion-card.is-emphasized .opinion-role":
            {
              color: "#fff",
            },
          ".people-opinion-card.is-emphasized .opinion-meta": {
            borderTopColor: "rgba(255, 255, 255, 0.5)",
          },
          ".people-opinion-card.is-emphasized .quote-inactive": {
            opacity: 0,
          },
          ".people-opinion-card.is-emphasized .quote-active": {
            opacity: 1,
          },
        }}
      >
        <Swiper
          dir="ltr"
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={300}
          loop
          centeredSlides
          watchSlidesProgress
          roundLengths
          speed={650}
          maxBackfaceHiddenSlides={0}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          onSetTransition={(swiper, duration) => {
            const opinionSwiper = swiper as OpinionSwiper;
            opinionSwiper.__opinionDuration = duration;
            opinionSwiper.el?.style.setProperty(
              "--opinion-motion",
              `${duration}ms`
            );
          }}
          onSwiper={applyOpinionMotion}
          onProgress={applyOpinionMotion}
          onResize={applyOpinionMotion}
          breakpoints={{
            900: {
              slidesPerView: 3,
              spaceBetween: 150,
            },
          }}
          style={{
            paddingTop: 72,
            paddingBottom: 72,
            overflow: "visible",
          }}
        >
          {commentData.map((comment) => (
            <SwiperSlide key={comment._id}>
              <Stack className="people-opinion-card">
                <Stack
                  className="people-opinion-face"
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    isolation: "isolate",
                    background:
                      "linear-gradient(to bottom left, #FFD9C5, #FFDEDB)",
                    minHeight: { xs: 100, sm: 150 },
                    p: 4,
                    px: 5,
                    borderRadius: "38px",
                    direction: "ltr",
                    gap: 2,
                  }}
                >
                  <Box
                    className="opinion-wash"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      pointerEvents: "none",
                      background:
                        "linear-gradient(to bottom left, #FD8342, #EE5246)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      width: { xs: 22, sm: 42 },
                      height: { xs: 22, sm: 42 },
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      className="quote-icon quote-inactive"
                      src="/pink-qout.png"
                      alt=""
                      fill
                      sizes="42px"
                    />
                    <Image
                      className="quote-icon quote-active"
                      src="/white-qout.png"
                      alt=""
                      fill
                      sizes="42px"
                    />
                  </Box>
                  <Stack
                    sx={{ position: "relative", zIndex: 1, height: "100%" }}
                  >
                    <Typography
                      className="opinion-text"
                      sx={{
                        position: "relative",
                        zIndex: 1,
                        width: "100%",
                        direction: "ltr",
                        textAlign: "justify",
                        textAlignLast: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 4,
                        whiteSpace: "normal",
                        lineHeight: 1.45,
                        minHeight: "calc(1.45em * 4)",
                        fontSize: { xs: 14, sm: 18 },
                        fontFamily: "Namecat",
                        letterSpacing: 1,
                      }}
                    >
                      {comment.text}
                    </Typography>
                  </Stack>
                  <Stack
                    className="opinion-meta"
                    direction="row"
                    sx={{ position: "relative", zIndex: 1 }}
                  >
                    <Avatar
                      alt={comment.username}
                      sx={{
                        objectFit: "cover",
                        bgcolor: "secondary.light",
                        borderRadius: "50%",
                        border: "3px solid #fff",
                        width: { xs: 42, sm: 55 },
                        height: { xs: 42, sm: 55 },
                      }}
                    />
                    <Stack sx={{ alignItems: "start" }}>
                      <Typography
                        sx={{
                          fontSize: { xs: 14, sm: 18 },
                          fontWeight: 600,
                          color: "#000",
                          fontFamily: "Namecat",
                          letterSpacing: 1,
                        }}
                      >
                        {comment.username}
                      </Typography>
                      {shouldShowTargetSubtitle(comment.targetType) ? (
                        <Typography
                          className="opinion-role"
                          sx={{
                            fontSize: { xs: 12, sm: 14 },
                            fontFamily: "Namecat",
                            letterSpacing: 2,
                          }}
                        >
                          {comment.targetType}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
    </Stack>
  );
};

export default PeopleOpinion;
