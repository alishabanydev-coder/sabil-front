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
import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { isNativeApp } from "@/lib/capacitor/nativeApp";
import { Swiper, SwiperSlide } from "swiper/react";
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
import { useEffect, useRef, useState } from "react";

type NavigationButtonData = {
  id: string;
  type: "home" | "project";
  title: string;
  image: string;
  projectId?: string;
};

type VideoData = {
  _id: string;
  projectId: string;
  title: string;
  thumbnail: string;
  season?: number;
  episode?: number;
};

const NAV_SKELETON_COUNT = 4;

const Navbar = ({
  allVideos,
  navigationButtons,
  selectedNav,
  setSelectedNav,
}: {
  allVideos: VideoData[];
  navigationButtons: NavigationButtonData[];
  selectedNav: string;
  setSelectedNav: (nav: string) => void;
}) => {
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => setIsReady(true), 40);
      });
    });

    return () => cancelAnimationFrame(id);
  }, []);

  const handleLogout = () => {
    if (isNativeApp()) {
      void App.exitApp();
      return;
    }

    router.push("/");
  };

  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "1447 / 480",
        backgroundImage: "url(/navbarBackground.png)",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        mb: 5,
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          px: { xs: 2, md: 5 },
        }}
      >
        <Stack
          direction="row"
          sx={{
            gap: 1,
            alignItems: "center",
            position: "absolute",
            top: 20,
            right: { md: 45, lg: 56 },
            zIndex: 120, // was 110 — now higher than the sibling logo+icons Stack
          }}
        >
          <IconButton
            onClick={handleLogout}
            sx={{
              fontSize: { xs: 12, sm: 14, md: 16, lg: 18 },
              color: "#ffff",
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
            <LogoutIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>

          <Button
            color="primary"
            href="/downloads/sabeel-kids.apk"
            download
            sx={{
              display: { xs: "none", md: "inline-flex" },
              borderRadius: 6,
              bgcolor: "secondary.main",
              fontFamily: "Namecat",
              letterSpacing: 1.2,
              fontSize: 14,
              color: "#fff",
              px: 1.4,
              border: "1px solid",
              borderColor: "#fff",
              backdropFilter: "blur(8px)",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
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
            aria-label="download app"
            startIcon={<FileDownloadIcon sx={{ fontSize: 24 }} />}
          >
            Download App
          </Button>

          <Avatar
            src="/userAvatar.png"
            alt="avatar"
            sx={{
              cursor: "pointer",
              width: { md: 35, lg: 42 },
              height: { md: 35, lg: 42 },
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

        {/* logout + icons */}
        <Stack
          direction="row"
          sx={{
            gap: 1,
            width: { md: "96%", lg: "98%" },
            pt: { md: 3, lg: 5 },
            mx: "auto",
            alignItems: "center",
            zIndex: 110,
            "& .logo": {
              width: { xs: 45, sm: 45, md: 130, lg: 150 },
              height: { xs: 45, sm: 45, md: 130, lg: 150 },
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
              width: { xs: "80%", sm: "100%" },
              mx: "auto",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: { md: 3, lg: 5 },
              pr: { xs: 8, sm: 8, md: 17, lg: 19 },
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
                        borderRadius: 3,
                        p: { xs: 1, md: 0.8, lg: 1 },
                        bgcolor: (theme) =>
                          isSelected
                            ? alpha(theme.palette.primary.main, 0.5)
                            : alpha(theme.palette.background.paper, 0.08),
                        backdropFilter: "blur(2px)",
                        WebkitBackdropFilter: "blur(2px)",
                        border: "3px solid",
                        borderColor: (theme) =>
                          isSelected
                            ? alpha(theme.palette.warning.main, 0.7)
                            : alpha(theme.palette.background.paper, 0.15),
                        boxShadow: isSelected
                          ? "0 4px 20px rgba(0, 0, 0, 0.2)"
                          : "0 4px 16px rgba(0, 0, 0, 0.08)",
                        transition: "all 0.3s ease",
                        "& img": {
                          filter: isSelected ? "none" : "grayscale(100%)",
                          width: { xs: 35, sm: 42, md: 80, lg: 90 },
                          height: { xs: 30, sm: 46, md: 75, lg: 85 },
                          transition: "filter 0.3s ease",
                        },
                        "&:hover": {
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          bgcolor: (theme) =>
                            isSelected
                              ? alpha(theme.palette.primary.main, 0.6)
                              : alpha(theme.palette.background.paper, 0.1),
                          "& img": {
                            filter: isSelected ? "none" : "grayscale(30%)",
                          },
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
                      width: { xs: 35, sm: 42, md: 64, lg: 110 },
                      height: { xs: 35, sm: 42, md: 64, lg: 110 },
                      borderRadius: 3,
                    }}
                  />
                ))}
          </Stack>
        </Stack>
      </Stack>

      <Stack
        ref={containerRef}
        sx={{
          position: "absolute",
          bottom: -80,
          left: 0,
          width: "100%",
          aspectRatio: "1448 / 460",
          minHeight: { xs: 200, sm: 260, md: 340 },
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
            minHeight: { xs: 200, sm: 260, md: 340 },
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
            },
            "& .swiper-pagination-bullet-active": {
              bgcolor: "primary.main",
              borderRadius: "14px",
              width: 40,
              height: 10,
            },
          }}
        >
          {/* FIXME: fix the buttons position it stand higher */}
          {isReady ? (
            <>
              <Box
                className="swiper-button-prev"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: { xs: 12, sm: 30, md: 40, lg: 50 },
                  transform: "translateY(-50%)",
                  zIndex: 20,
                  width: { xs: 30, sm: 35, md: 40, lg: 45 },
                  height: { xs: 30, sm: 35, md: 40, lg: 45 },
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
                    transform: "translateY(-50%) scale(1.05)",
                    boxShadow: (t) => t.shadows[10],
                  },
                  "&::after": { display: "none" },
                }}
              >
                <NavigateBeforeRoundedIcon
                  sx={{ fontSize: { xs: 22, sm: 26, md: 34, lg: 42 } }}
                />
              </Box>

              <Box
                className="swiper-button-next"
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: { xs: 12, sm: 30, md: 40, lg: 50 },
                  transform: "translateY(-50%)",
                  zIndex: 20,
                  width: { xs: 30, sm: 35, md: 40, lg: 45 },
                  height: { xs: 30, sm: 35, md: 40, lg: 45 },
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
                    transform: "translateY(-50%) scale(1.05)",
                    boxShadow: (t) => t.shadows[10],
                  },
                  "&::after": { display: "none" },
                }}
              >
                <NavigateNextRoundedIcon
                  sx={{ fontSize: { xs: 22, sm: 26, md: 34, lg: 42 } }}
                />
              </Box>

              {/* Pagination */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  position: "absolute",
                  bottom: 35,
                  zIndex: 10,
                }}
              >
                <Box className="swiper-pagination" />
              </Box>
              <Swiper
                modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                pagination={{ clickable: true, el: ".swiper-pagination" }}
                observer={true}
                observeParents={true}
                effect="coverflow"
                centeredSlides
                loop
                slidesPerView={3.6}
                watchSlidesProgress
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
                  const update = () => {
                    swiper.update();
                    swiper.navigation?.update();
                    swiper.pagination?.update();
                  };
                  requestAnimationFrame(() => requestAnimationFrame(update));
                  setTimeout(update, 80);
                }}
              >
                {allVideos.map((video) => (
                  <SwiperSlide
                    key={video._id}
                    onClick={() => router.push(`/app/watch/${video._id}`)}
                  >
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      sizes="(max-width: 600px) 80vw, (max-width: 1200px) 40vw, 28vw"
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
                          sx={{ fontSize: { xs: 36, sm: 48, md: 64, lg: 75 } }}
                        />
                      </Box>
                    </Stack>
                  </SwiperSlide>
                ))}
              </Swiper>
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
    </Stack>
  );
};

export default Navbar;
