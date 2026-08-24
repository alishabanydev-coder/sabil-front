"use client";

import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import {
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
        mb: 10,
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
            zIndex: 101,
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
              "&:hover": {
                bgcolor: "secondary.main",
                borderColor: "#fff",
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
            }}
            aria-label="download app"
            startIcon={<FileDownloadIcon sx={{ fontSize: 24 }} />}
          >
            Download App
          </Button>

          <Avatar
            src="/userAvatar.png"
            alt="avatar"
            sx={{ width: { md: 35, lg: 42 }, height: { md: 35, lg: 42 } }}
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
            zIndex: 100,
            "& .logo": {
              width: { xs: 45, sm: 45, md: 120, lg: 140 },
              height: { xs: 45, sm: 45, md: 120, lg: 140 },
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
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "center",
              gap: { md: 3, lg: 5 },
              pl: { md: 8, lg: 10 },
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
                        filter: isSelected ? "none" : "grayscale(100%)",
                        transition: "all 0.3s ease",
                        "& img": {
                          width: { xs: 35, sm: 42, md: 90, lg: 110 },
                          height: { xs: 35, sm: 42, md: 90, lg: 110 },
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
                    variant="circular"
                    animation="wave"
                    sx={{
                      width: { xs: 35, sm: 42, md: 64, lg: 110 },
                      height: { xs: 35, sm: 42, md: 64, lg: 110 },
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
            // IMPORTANT: let aspect-ratio control the height
            aspectRatio: "1448 / 460",
            minHeight: { xs: 200, sm: 260, md: 340 },
            // remove height: "100%" — it fights with aspect-ratio

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
          {isReady ? (
            <>
              <Box
                className="swiper-button-prev"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: { xs: 12, sm: 20, md: 28 },
                  transform: "translateY(-50%)",
                  zIndex: 20,
                  height: "10%",
                  aspectRatio: "1 / 1",
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
                  right: { xs: 12, sm: 20, md: 28 },
                  transform: "translateY(-50%)",
                  zIndex: 20,
                  height: "10%",
                  aspectRatio: "1 / 1",
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
                  bottom: 45,
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
