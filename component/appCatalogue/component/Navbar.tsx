"use client";

import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar, Button, IconButton, Skeleton, Stack } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { isNativeApp } from "@/lib/capacitor/nativeApp";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

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
        sx={{
          position: "absolute",
          bottom: -80,
          left: 0,
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          aspectRatio: "1448 / 460",
          backgroundImage: "url(/featuredBackground.png)",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            position: "relative",
            width: "100%",
            aspectRatio: "1448 / 460",
            justifyContent: "center",
            alignItems: "center",
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
            },
            "& .swiper-slide img": {
              objectFit: "contain",
            },
          }}
        >
          <Swiper
            modules={[EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop
            slidesPerView={3.6}
            watchSlidesProgress
            onProgress={(swiper) => {
              swiper.slides.forEach((slideEl) => {
                const progress =
                  (slideEl as HTMLElement & { progress?: number }).progress ??
                  0;
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
          >
            {allVideos.map((video) => (
              <SwiperSlide key={video._id}>
                <Image src={video.thumbnail} alt={video.title} fill />
              </SwiperSlide>
            ))}
          </Swiper>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Navbar;
