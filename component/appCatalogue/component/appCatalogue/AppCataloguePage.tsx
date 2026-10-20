"use client";

import { alpha, Skeleton, Stack, Typography } from "@mui/material";
import ChannelFeaturedRail from "../ChannelFeaturedRail";
import type { AppCatalogueProps } from "../navbarTypes";
import AppCataloguePageCard from "./component/AppCataloguePageCard";

const CARD_SKELETON_COUNT = 6;

export default function AppCataloguePage({
  navigationButtons,
  selectedVideos,
  homeVideos,
  suggestedVideos,
  featuredVideos,
  allVideos,
  selectedNav = "home",
}: AppCatalogueProps) {
  const isHome = selectedNav === "home";

  const isCatalogueLoading =
    navigationButtons.length === 0 &&
    homeVideos.length === 0 &&
    suggestedVideos.length === 0 &&
    allVideos.length === 0;

  return (
    <Stack
      sx={{
        gap: 1,
        color: "#fff",
        pt: isHome
          ? { xs: 3, sm: 7, md: 5, lg: 3 }
          : { xs: 3, sm: 2, md: 2, lg: 1.5 },
        pb: 2,
        flex: { xs: 1, sm: "none" },
        minHeight: { xs: 0, sm: "auto" },
        overflow: { xs: "auto", sm: "visible" },
        WebkitOverflowScrolling: { xs: "touch", sm: "auto" },
        scrollbarWidth: "thin",
        scrollbarColor: `#5c0c97 ${alpha("#ddd", 0.5)}`,

        "&::-webkit-scrollbar": {
          width: 8,
          height: 6,
        },
        "&::-webkit-scrollbar-button": {
          display: "none !important",
          width: "0 !important",
          height: "0 !important",
          background: "transparent !important",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#5c0c97",
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
      {isHome ? (
        <Typography
          variant="h6"
          sx={{
            display: { xs: "none", sm: "block" },
            width: "82%",
            mx: "auto",
            textAlign: "start",
            fontWeight: 800,
            fontSize: { xs: 24, md: 36 },
            textTransform: "uppercase",
            color: "primary.main",
          }}
        >
          Explore by theme
        </Typography>
      ) : (
        <ChannelFeaturedRail
          videos={featuredVideos}
          isLoading={isCatalogueLoading}
        />
      )}
      {/* cards */}
      <Stack
        sx={{
          display: "grid",
          width: { xs: "88%", sm: "82%" },
          mx: "auto",
          gap: { xs: 1, md: 3 },
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {isCatalogueLoading
          ? Array.from({ length: CARD_SKELETON_COUNT }, (_, index) => (
              <Stack
                key={`card-skeleton-${index}`}
                sx={{
                  width: "100%",
                  pb: 0.5,
                  border: "1px solid #aaa",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ width: "100%", height: { xs: 101, md: 182 } }}
                />
                <Stack
                  direction="row"
                  sx={{ pl: 0.8, gap: 1, alignItems: "center", pt: 0.5 }}
                >
                  <Skeleton
                    variant="circular"
                    animation="wave"
                    sx={{
                      width: { xs: 30, md: 46 },
                      height: { xs: 30, md: 46 },
                      flexShrink: 0,
                    }}
                  />
                  <Stack sx={{ width: "100%", gap: 0.75 }}>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      sx={{
                        width: "80%",
                        height: { xs: 12, md: 18 },
                        borderRadius: 1,
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      sx={{
                        width: "55%",
                        height: { xs: 10, md: 12 },
                        borderRadius: 1,
                      }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            ))
          : selectedVideos.map((item) => (
              <AppCataloguePageCard key={item._id} video={item} />
            ))}
      </Stack>
    </Stack>
  );
}
