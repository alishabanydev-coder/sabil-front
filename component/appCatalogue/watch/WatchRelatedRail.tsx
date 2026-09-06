"use client";

import { Box, Skeleton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { WatchCatalogueVideo } from "./buildWatchRelatedVideos";
import { useNativeApp } from "@/lib/capacitor/nativeApp";

//FIXME: add switch button to toggle between Urdo and English in videoPage and SabeelToons.
//FIXME: add Admin panel for the Featured Videos and Swiper videos in HomePage.

const SKELETON_COUNT = 6;
const MOBILE_SKELETON_COUNT = 4;

type WatchRelatedRailProps = {
  isNative: boolean;
  videos: WatchCatalogueVideo[];
  isLoading: boolean;
};

const slideStyle = {
  height: "100%",
  width: "auto",
};

function RelatedVideoCard({ item }: { item: WatchCatalogueVideo }) {
  const router = useRouter();
  const isNative = useNativeApp();

  const projectName = item.projectTitle?.trim() || "Project";

  return (
    <Stack
      onClick={() => router.push(`/app/watch/${item._id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/app/watch/${item._id}`);
        }
      }}
      tabIndex={0}
      role="button"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 2,
        boxShadow: 5,
        cursor: "pointer",
        overflow: "hidden",
        bgcolor: "white",
        flexShrink: 0,
        transition: "all 0.3s ease",
        "&:hover, &:focus-visible": {
          boxShadow: (theme) =>
            `0px 2px 10px 1px ${theme.palette.primary.main}`,
          "& .watch-related-rail-image": {
            transform: "scale(1.1) rotate(3deg)",
          },
          "& .watch-related-rail-meta": {
            opacity: 1,
            visibility: "visible",
            transform: "translateY(0)",
          },
          "& .watch-related-rail-play-button": {
            transform: "translateY(0)",
            scale: 1.1,
          },
        },
      }}
    >
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          bgcolor: "action.hover",
        }}
      >
        {item.thumbnail ? (
          <Image
            className="watch-related-rail-image"
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="40vw"
            style={{
              objectFit: "contain",
              transition: "all 0.3s ease",
            }}
          />
        ) : null}
      </Stack>

      <Stack
        className="watch-related-rail-meta"
        direction="row"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          gap: 1,
          alignItems: "center",
          opacity: 0,
          visibility: "hidden",
          transform: "translateY(8px)",
          transition: "all 0.3s ease",
        }}
      >
        <Stack
          sx={{
            width: "100%",
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.5)",
            pl: isNative ? 5 : { xs: 7, sm: 7 },
            position: "relative",
            pt: isNative ? 0.8 : { xs: 1.2, sm: 1 },
            pb: { xs: 0.8, sm: 0 },
          }}
        >
          <Box
            className="watch-related-rail-play-button"
            sx={{
              position: "absolute",
              left: isNative ? 8 : 12,
              top: isNative ? -14 : { xs: -20, sm: -20 },
              width: isNative ? 30 : { xs: 40, sm: 38, md: 38, lg: 42 },
              height: isNative ? 30 : { xs: 40, sm: 40, md: 40, lg: 42 },
              borderRadius: "50%",
              boxShadow: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "white",
              transition: "all 0.3s ease",
            }}
          >
            <PlayArrowRoundedIcon
              sx={{
                fontSize: isNative ? 30 : { xs: 36, md: 45, lg: 36 },
                color: "primary.main",
              }}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontFamily: "Namecat",
              fontWeight: 700,
              fontSize: { xs: 12, md: 14, lg: 16 },
              letterSpacing: 1.5,
              textTransform: "uppercase",
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "text.secondary",
              fontWeight: 300,
              fontFamily: "Namecat",
              letterSpacing: 2,
              fontSize: { xs: 10, md: 11, lg: 12 },
            }}
          >
            {projectName}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

function RelatedVideoSkeleton({ fullWidth }: { fullWidth?: boolean }) {
  return (
    <Stack
      sx={{
        width: fullWidth ? "100%" : "100%",
        height: fullWidth ? "auto" : "100%",
        aspectRatio: fullWidth ? "16 / 9" : undefined,
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "white",
        boxShadow: 3,
        flexShrink: 0,
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          height: "100%",
          minHeight: fullWidth ? undefined : "100%",
        }}
      />
    </Stack>
  );
}

const WatchRelatedRail = ({
  isNative,
  videos,
  isLoading,
}: WatchRelatedRailProps) => {
  return (
    <Stack
      sx={{
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        "& .swiper": {
          px: 2,
          py: isNative ? 0 : 1,
          pt: isNative ? 0.5 : 0.8,
          pb: isNative ? 0.5 : 1.5,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        },
        "& .swiper-wrapper": {
          height: "100%",
          alignItems: "stretch",
        },
        "& .swiper-slide": {
          height: "100%",
          width: "auto",
          aspectRatio: "16 / 9",
          display: "flex",
          alignItems: "stretch",
        },
      }}
    >
      <Stack
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "column",
          gap: 1.5,
          width: "100%",
          height: "100%",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: 2,
          py: 2.5,
          boxSizing: "border-box",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          scrollbarColor: (theme) =>
            `${theme.palette.primary.main} transparent`,
          "&::-webkit-scrollbar": {
            width: 8,
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-button": {
            display: "none",
            width: 0,
            height: 0,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.main",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-corner": {
            backgroundColor: "transparent",
          },
        }}
      >
        {isLoading
          ? Array.from({ length: MOBILE_SKELETON_COUNT }, (_, index) => (
              <RelatedVideoSkeleton
                key={`mobile-skeleton-${index}`}
                fullWidth
              />
            ))
          : videos.map((item) => (
              <Stack
                key={item._id}
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  flexShrink: 0,
                }}
              >
                <RelatedVideoCard item={item} />
              </Stack>
            ))}
      </Stack>

      <Stack
        sx={{
          display: { xs: "none", sm: "block" },
          width: "100%",
          height: "100%",
          minHeight: 0,
        }}
      >
        <Swiper slidesPerView="auto" spaceBetween={12} observer observeParents>
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <SwiperSlide key={`skeleton-${index}`} style={slideStyle}>
                  <RelatedVideoSkeleton />
                </SwiperSlide>
              ))
            : videos.map((item) => (
                <SwiperSlide key={item._id} style={slideStyle}>
                  <RelatedVideoCard item={item} />
                </SwiperSlide>
              ))}
        </Swiper>
      </Stack>
    </Stack>
  );
};

export default WatchRelatedRail;
