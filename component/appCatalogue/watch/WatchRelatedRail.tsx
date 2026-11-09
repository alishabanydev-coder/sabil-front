"use client";

import {
  alpha,
  Box,
  Divider,
  keyframes,
  Skeleton,
  Stack,
  SvgIconProps,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { WatchCatalogueVideo } from "../utils/buildWatchRelatedVideos";
import { useNativeApp } from "@/lib/capacitor/nativeApp";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { ElementType } from "react";
import { compactStat } from "../component/appCatalogue/component/compactStat";

//FIXME: add switch button to toggle between Urdo and English in videoPage and SabeelToons.

const SKELETON_COUNT = 6;
const MOBILE_SKELETON_COUNT = 4;

type WatchRelatedRailProps = {
  isNative: boolean;
  videos: WatchCatalogueVideo[];
  isLoading: boolean;
};

type ReactionKind = "save" | "like" | "view";

type StatConfig = {
  kind: ReactionKind;
  color: [string, string];
  label: string;
  activeIcon: ElementType<SvgIconProps>;
  number: number;
};

function GradientIcon({
  icon: Icon,
  colors,
}: {
  icon: ElementType<SvgIconProps>;
  colors: [string, string];
}) {
  return (
    <Icon
      sx={{
        fontSize: { xs: 16, sm: 18, md: 20, lg: 22, xl: 24 },
        fill: colors[0],
      }}
    />
  );
}

const STATS = (value: WatchCatalogueVideo): StatConfig[] => [
  {
    kind: "save",
    color: ["#0F70E3", "#044CD4"],
    label: "save",
    activeIcon: BookmarkOutlinedIcon,
    number: value.saveCount ?? 0,
  },
  {
    kind: "like",
    color: ["#FB5C73", "#FB2C5C"],
    label: "likes",
    activeIcon: FavoriteRoundedIcon,
    number: value.likeCount ?? 0,
  },
  {
    kind: "view",
    color: ["#7E4DDE", "#6C32C9"],
    label: "views",
    activeIcon: VisibilityRoundedIcon,
    number: value.viewCount ?? 0,
  },
];

const slideStyle = {
  height: "100%",
  width: "auto",
};

const playButtonWave = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.85);
    opacity: 0;
  }
`;

function RelatedVideoCard({ item }: { item: WatchCatalogueVideo }) {
  const router = useRouter();
  const isNative = useNativeApp();

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
          "& .app-catalogue-page-play-button": {
            bgcolor: alpha("#fff", 0.85),
            scale: 1.1,
            transition: "all 0.3s ease",
          },
          "& .app-catalogue-play-wave": {
            animationName: `${playButtonWave}`,
            animationDuration: "1.45s",
            animationTimingFunction: "ease-out",
            animationIterationCount: "infinite",
          },
          "& .app-catalogue-play-wave-late": {
            animationDelay: "0.5s",
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

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: {
            xs: "calc(50% - 25px)",
            sm: "calc(50% - 30px)",
            lg: "calc(50% - 35px)",
          },
          width: { xs: 50, sm: 48, md: 64, lg: 66, xl: 70 },
          height: { xs: 50, sm: 48, md: 64, lg: 66, xl: 70 },
          transform: "translateX(-50%)",
        }}
      >
        {[
          "app-catalogue-play-wave",
          "app-catalogue-play-wave app-catalogue-play-wave-late",
        ].map((waveClass) => (
          <Box
            key={waveClass}
            aria-hidden
            className={waveClass}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: "primary.main",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              transform: "scale(1)",
              transformOrigin: "center",
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        ))}
        <Box
          className="app-catalogue-page-play-button"
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            boxShadow: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: alpha("#fff", 0.7),
            cursor: "pointer",
          }}
        >
          <PlayArrowRoundedIcon
            sx={{
              fontSize: { xs: 45, sm: 42, md: 54, lg: 60, xl: 64 },
              color: "primary.main",
            }}
          />
        </Box>
      </Box>

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
            bgcolor: "rgba(0, 0, 0, 0.8)",
            borderRadius: 0,
            boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.5)",
            px: 1,
            position: "relative",
            pt: { xs: 0.3, md: 0.8 },
            pb: { xs: 0.3, md: 0.7 },
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: { xs: 0.5, sm: 1, md: 2 },
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {STATS(item).map((action, index) => (
              <>
                <Stack
                  key={action.kind}
                  direction="row"
                  sx={{
                    gap: { xs: 0, sm: 0.3, md: 0.5 },
                    alignItems: "center",
                  }}
                >
                  <GradientIcon
                    icon={action.activeIcon}
                    colors={action.color}
                  />
                  <Typography
                    sx={{
                      color: action.color[0],
                      fontWeight: 600,
                      fontSize: { xs: 12, sm: 13, md: 16, lg: 18, xl: 20 },
                    }}
                  >
                    {compactStat(action.number ?? 0)}
                  </Typography>
                </Stack>
                {index < STATS(item).length - 1 && (
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ height: 22, bgcolor: "rgba(255, 255, 255, 0.3)" }}
                  />
                )}
              </>
            ))}
          </Stack>
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
