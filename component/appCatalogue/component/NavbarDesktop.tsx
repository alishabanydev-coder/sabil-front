"use client";

import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  alpha,
  Avatar,
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useNavbarController } from "./useNavbarController";
import type { NavbarProps } from "./navbarTypes";

const relayoutFeaturedSwiper = (swiper: SwiperType) => {
  if (swiper.destroyed) return;
  swiper.update();
  swiper.navigation?.update?.();
  swiper.pagination?.render?.();
  swiper.pagination?.update?.();
};

const NAV_SKELETON_COUNT = 4;

const NavbarDesktop = ({
  suggestedVideos,
  navigationButtons,
  selectedNav,
  setSelectedNav,
}: NavbarProps) => {
  const { router, isReady, handleLogout } = useNavbarController();
  const paginationRef = useRef<HTMLDivElement>(null);
  const prevElRef = useRef<HTMLDivElement>(null);
  const nextElRef = useRef<HTMLDivElement>(null);
  const [swiperMounted, setSwiperMounted] = useState(false);
  const isHome = selectedNav === "home";

  useEffect(() => {
    if (!isReady || !isHome) {
      setSwiperMounted(false);
      return;
    }

    const id = window.requestAnimationFrame(() => {
      setSwiperMounted(true);
    });

    return () => window.cancelAnimationFrame(id);
  }, [isReady, isHome]);

  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "1447 / 480",
        backgroundImage: "url(/application-background.png)",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        mb: isHome ? 5 : { sm: 1, md: 0 },
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          px: { sm: 2, md: 5 },
        }}
      >
        <Stack
          direction="row"
          sx={{
            gap: 1,
            alignItems: "center",
            position: "absolute",
            top: 20,
            right: { sm: 20, md: 36, lg: 54 },
            zIndex: 120,
          }}
        >
          <IconButton
            onClick={handleLogout}
            sx={{
              width: { sm: 36, md: 38, lg: 44 },
              height: { sm: 36, md: 38, lg: 44 },
              p: 0,
              color: "#fff",
              bgcolor: "secondary.main",
              border: "1px solid",
              borderColor: "#fff",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "secondary.main",
                borderColor: "#fff",
                transform: "translateY(-1px)",
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.2), " +
                  "2px 2px 4px 0 rgba(0, 0, 0, 0.3), " +
                  "-2px -2px 4px 0 rgba(0, 0, 0, 0.2), " +
                  "inset -4px -4px 6px 0 rgba(255, 255, 255, 0), " +
                  "inset 4px 4px 6px 0 rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <LogoutIcon sx={{ fontSize: { sm: 20, md: 20, lg: 24 } }} />
          </IconButton>

          <Button
            color="primary"
            href="/downloads/sabeel-kids.apk"
            download
            sx={{
              minWidth: { sm: 36, md: "auto" },
              width: { sm: 36, md: "auto" },
              height: { sm: 36, md: 38, lg: 44 },
              borderRadius: { sm: "50%", md: 6 },
              bgcolor: "secondary.main",
              fontFamily: "Namecat",
              letterSpacing: 1.2,
              lineHeight: 1,
              fontSize: { md: 13, lg: 14 },
              color: "#fff",
              px: { sm: 0, md: 1.5, lg: 1.75 },
              py: 0,
              border: "1px solid",
              borderColor: "#fff",
              backdropFilter: "blur(8px)",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
              transition: "all 0.3s ease",
              "& .MuiButton-startIcon": {
                m: { sm: 0, md: "0 6px 0 -2px" },
              },
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.2), " +
                  "2px 2px 4px 0 rgba(0, 0, 0, 0.3), " +
                  "-2px -2px 4px 0 rgba(0, 0, 0, 0.2), " +
                  "inset -4px -4px 6px 0 rgba(255, 255, 255, 0), " +
                  "inset 4px 4px 6px 0 rgba(0, 0, 0, 0.3)",
              },
            }}
            aria-label="download app"
            startIcon={
              <FileDownloadIcon sx={{ fontSize: { sm: 20, md: 18, lg: 22 } }} />
            }
          >
            <Box
              component="span"
              sx={{ display: { sm: "none", md: "inline" } }}
            >
              Download App
            </Box>
          </Button>

          <Avatar
            src="/userAvatar.png"
            alt="avatar"
            sx={{
              cursor: "pointer",
              width: { sm: 36, md: 38, lg: 44 },
              height: { sm: 36, md: 38, lg: 44 },
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.2), " +
                  "2px 2px 4px 0 rgba(0, 0, 0, 0.3), " +
                  "-2px -2px 4px 0 rgba(0, 0, 0, 0.2), " +
                  "inset -4px -4px 6px 0 rgba(255, 255, 255, 0), " +
                  "inset 4px 4px 6px 0 rgba(0, 0, 0, 0.3)",
              },
            }}
          />
        </Stack>

        <Stack
          direction="row"
          sx={{
            gap: 1,
            width: { sm: "94%", md: "96%", lg: "98%" },
            pt: { sm: 7, md: 6 },
            mx: "auto",
            alignItems: "center",
            zIndex: 110,
            "& .logo": {
              width: { sm: 90, md: 140, lg: 165 },
              height: { sm: 85, md: 130, lg: 150 },
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05) rotate(-5deg)",
              },
            },
          }}
        >
          <Image
            className="logo"
            src="/new-logo.png"
            alt="sabeel kids logo"
            width={72}
            height={72}
          />
          <Stack
            sx={{
              width: "100%",
              mx: "auto",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: { sm: 0.8, md: 1.2, lg: 2 },
              pt: 1,
              pr: { sm: 8, md: 17, lg: 19 },
            }}
          >
            {navigationButtons.length > 0
              ? navigationButtons.map((item) => {
                  const buttonId =
                    item.type === "project" && item.projectId
                      ? item.projectId
                      : "home";
                  const isSelected = selectedNav === buttonId;
                  return (
                    <Stack
                      key={item.id}
                      sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        borderRadius: { sm: 5, md: 8, lg: 8 },
                        p: { sm: 0.3, md: 0.8, lg: 1 },
                        bgcolor: (theme) =>
                          isSelected
                            ? alpha(theme.palette.primary.main, 0.9)
                            : alpha(theme.palette.background.paper, 1),
                        boxShadow: isSelected ? 3 : 4,
                        border: "3px solid",
                        borderColor: (theme) =>
                          isSelected
                            ? alpha(theme.palette.warning.main, 1)
                            : alpha(theme.palette.background.paper, 1),
                        transition: "all 0.3s ease",
                        "& img": {
                          width: { sm: 60, md: 85, lg: 110 },
                          height: { sm: 50, md: 70, lg: 85 },
                          transition: "filter 0.3s ease",
                        },
                        "&:hover": {
                          backdropFilter: "blur(2px)",
                          WebkitBackdropFilter: "blur(2px)",
                          borderColor: (theme) =>
                            isSelected
                              ? alpha(theme.palette.warning.main, 0.8)
                              : alpha(theme.palette.background.paper, 0.2),
                          bgcolor: (theme) =>
                            isSelected
                              ? alpha(theme.palette.primary.main, 0.8)
                              : alpha(theme.palette.background.paper, 0.1),
                        },
                      }}
                      onClick={() => {
                        setSelectedNav(buttonId);
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={110}
                        height={110}
                        style={{ objectFit: "contain" }}
                      />
                    </Stack>
                  );
                })
              : Array.from({ length: NAV_SKELETON_COUNT }, (_, index) => (
                  <Skeleton
                    key={`nav-skeleton-${index}`}
                    variant="rounded"
                    animation="wave"
                    sx={{
                      width: { sm: 42, md: 64, lg: 110 },
                      height: { sm: 42, md: 64, lg: 110 },
                      borderRadius: 3,
                    }}
                  />
                ))}
          </Stack>
        </Stack>
      </Stack>

      {isHome && (
      <Stack
        sx={{
          position: "absolute",
          bottom: { sm: -110, md: -100, lg: -80 },
          left: 0,
          width: "100%",
          aspectRatio: "1448 / 460",
          minHeight: { sm: 260, md: 340 },
          backgroundImage: "url(/featuredBackground.png)",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Stack
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "1448 / 460",
            minHeight: { sm: 260, md: 340 },
            "& .swiper": {
              width: "100%",
              height: "100%",
            },
            "& .swiper-slide": {
              position: "relative",
              bgcolor: "#fff",
              height: "auto",
              aspectRatio: "16 / 9",
              alignSelf: "center",
              borderRadius: "14px",
              transitionProperty: "transform, opacity",
              overflow: "hidden",
              border: (theme) => `1px solid ${theme.palette.secondary.main}`,
              cursor: "pointer",
              boxShadow: 3,
              "& .play-button": {
                opacity: 0,
                visibility: "hidden",
                borderRadius: "50%",
                bgcolor: "#fff",
                width: "18%",
                aspectRatio: "1 / 1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: (theme) => `5px solid ${theme.palette.primary.main}`,
                transition: "all 0.3s ease",
                boxShadow: (theme) => theme.shadows[10],
              },
              "&.swiper-slide-active": { boxShadow: 10 },
              "&.swiper-slide-active .play-button": {
                opacity: 1,
                visibility: "visible",
              },
              "&:hover .play-button": {
                transform: "scale(1.05)",
                boxShadow: (theme) => theme.shadows[20],
              },
            },
            "& .swiper-slide img": { objectFit: "contain" },
            "& .swiper-pagination-desktop": {
              position: "static !important",
              inset: "auto !important",
              width: "auto !important",
              transform: "none !important",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& .swiper-pagination-bullet": {
              width: 8,
              height: 8,
              display: "inline-block",
              borderRadius: "50%",
              margin: "0 4px",
              bgcolor: "secondary.main",
              opacity: 1,
              cursor: "pointer",
              transition: "all 0.3s ease",
              flexShrink: 0,
            },
            "& .swiper-pagination-bullet-active": {
              bgcolor: "primary.main",
              borderRadius: "14px",
              width: 40,
              height: 10,
            },
          }}
        >
          {isReady ? (
            <>
              <Box
                ref={prevElRef}
                className="featured-swiper-prev-desktop"
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  my: "auto",
                  left: { sm: 30, md: 40, lg: 50 },
                  zIndex: 20,
                  width: { sm: 35, md: 40, lg: 45 },
                  height: { sm: 35, md: 40, lg: 45 },
                  borderRadius: "50%",
                  bgcolor: "secondary.main",
                  border: "1px solid white",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: (t) => t.shadows[10],
                  },
                }}
              >
                <NavigateBeforeRoundedIcon
                  sx={{ fontSize: { sm: 26, md: 34, lg: 42 } }}
                />
              </Box>

              <Box
                ref={nextElRef}
                className="featured-swiper-next-desktop"
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  my: "auto",
                  right: { sm: 30, md: 40, lg: 50 },
                  zIndex: 20,
                  width: { sm: 35, md: 40, lg: 45 },
                  height: { sm: 35, md: 40, lg: 45 },
                  borderRadius: "50%",
                  bgcolor: "secondary.main",
                  border: "1px solid white",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: (t) => t.shadows[10],
                  },
                }}
              >
                <NavigateNextRoundedIcon
                  sx={{ fontSize: { sm: 26, md: 34, lg: 42 } }}
                />
              </Box>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  position: "absolute",
                  left: 0,
                  bottom: 35,
                  zIndex: 10,
                }}
              >
                <Box
                  ref={paginationRef}
                  className="swiper-pagination-desktop"
                />
              </Box>
              {swiperMounted ? (
                <Swiper
                  modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  navigation={{
                    nextEl: nextElRef.current,
                    prevEl: prevElRef.current,
                  }}
                  pagination={{
                    clickable: true,
                    el: paginationRef.current,
                  }}
                  observer
                  observeParents
                  observeSlideChildren
                  effect="coverflow"
                  centeredSlides
                  loop={suggestedVideos.length >= 5}
                  slidesPerView={3.6}
                  watchSlidesProgress
                  onBeforeInit={(swiper) => {
                    const navigation = swiper.params.navigation;
                    const pagination = swiper.params.pagination;
                    if (navigation && typeof navigation !== "boolean") {
                      navigation.prevEl = prevElRef.current;
                      navigation.nextEl = nextElRef.current;
                    }
                    if (pagination && typeof pagination !== "boolean") {
                      pagination.el = paginationRef.current;
                    }
                  }}
                  onProgress={(swiper) => {
                    swiper.slides.forEach((slideEl) => {
                      const progress =
                        (slideEl as HTMLElement & { progress?: number })
                          .progress ?? 0;
                      const opacity = Math.min(
                        Math.max(3 - Math.abs(progress), 0),
                        1
                      );
                      slideEl.style.opacity = String(opacity);
                    });
                  }}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: "10%",
                    depth: 350,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  onSwiper={(swiper) => {
                    const update = () => relayoutFeaturedSwiper(swiper);
                    requestAnimationFrame(() => requestAnimationFrame(update));
                    window.setTimeout(update, 120);

                    const container = swiper.el;
                    if (typeof ResizeObserver === "undefined" || !container) {
                      return;
                    }

                    const observer = new ResizeObserver(() => {
                      relayoutFeaturedSwiper(swiper);
                    });
                    observer.observe(container);
                    swiper.on("destroy", () => observer.disconnect());
                  }}
                  onResize={(swiper) => relayoutFeaturedSwiper(swiper)}
                >
                  {suggestedVideos.map((video) => (
                    <SwiperSlide
                      key={video._id}
                      onClick={() => router.push(`/app/watch/${video._id}`)}
                    >
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="(max-width: 1200px) 40vw, 28vw"
                        style={{ objectFit: "contain" }}
                      />
                      <Stack
                        sx={{
                          position: "absolute",
                          inset: 0,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box className="play-button">
                          <PlayArrowRoundedIcon
                            color="secondary"
                            sx={{ fontSize: { sm: 48, md: 64, lg: 75 } }}
                          />
                        </Box>
                      </Stack>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    width="70%"
                    height="65%"
                    sx={{ borderRadius: 3 }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Skeleton
                variant="rounded"
                width="70%"
                height="65%"
                sx={{ borderRadius: 3 }}
              />
            </Box>
          )}
        </Stack>
      </Stack>
      )}
    </Stack>
  );
};

export default NavbarDesktop;
