"use client";

import { alpha, Box, Skeleton, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

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

type ProjectPreviewData = {
  _id?: string;
  id?: string;
  title: string;
  name?: string;
  image: string;
};

type AppCataloguePageProps = {
  navigationButtons: NavigationButtonData[];
  homeVideos: VideoData[];
  allVideos: VideoData[];
  selectedVideos: VideoData[];
};

const CARD_SKELETON_COUNT = 6;

export default function AppCataloguePage({
  navigationButtons,
  selectedVideos,
  homeVideos,
  allVideos,
}: AppCataloguePageProps) {
  const router = useRouter();

  const projectById = useMemo(() => {
    const projectMap = new Map<string, ProjectPreviewData>();
    navigationButtons
      .filter(
        (button): button is NavigationButtonData & { projectId: string } =>
          button.type === "project" && typeof button.projectId === "string"
      )
      .forEach((button) => {
        projectMap.set(button.projectId, {
          _id: button.projectId,
          title: button.title,
          name: button.title,
          image: button.image,
        });
      });
    return projectMap;
  }, [navigationButtons]);

  const isCatalogueLoading =
    navigationButtons.length === 0 &&
    homeVideos.length === 0 &&
    allVideos.length === 0;

  return (
    <Stack
      sx={{
        gap: 1,
        color: "#fff",
        pt: { xs: 3, sm: 7, md: 5, lg: 3 },
        pb: 2,
        flex: { xs: 1, sm: "none" },
        minHeight: { xs: 0, sm: "auto" },
        overflow: { xs: "auto", sm: "visible" },
        WebkitOverflowScrolling: { xs: "touch", sm: "auto" },

        scrollbarWidth: "thin",
        scrollbarColor: `#5c0c97 ${alpha('#ddd', .5)}`,

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
      <Typography
        variant="h6"
        sx={{
          display: { xs: "none", sm: "block" },
          width: "82%",
          mx: "auto",
          textAlign: "start",
          fontWeight: 700,
          fontSize: { xs: 18, md: 24 },
          textTransform: "uppercase",
          color: "primary.main",
          letterSpacing: 1.5,
          fontFamily: "Namecat",
        }}
      >
        Explore by theme
      </Typography>
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
          : selectedVideos.map((item) => {
              const project = projectById.get(item.projectId);
              const projectLogo = project?.image || item.thumbnail;
              const projectName = project?.title || project?.name || "Project";

              return (
                <Stack
                  key={item._id}
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
                    pb: 0.5,
                    borderRadius: { xs: 4, sm: 8 },
                    boxShadow: 3,
                    cursor: "pointer",
                    overflow: "hidden",
                    bgcolor: "white",
                    "&:hover": {
                      boxShadow: (theme) =>
                        `0px 2px 10px 1px ${theme.palette.primary.main}`,
                      "& .app-catalogue-page-image": {
                        transition: "all 0.3s ease",
                        transform: "scale(1.1) rotate(3deg)",
                      },
                      "& .app-catalogue-page-play-button": {
                        transform: "translateY(0)",
                        scale: 1.1,
                        transition: "all 0.3s ease",
                      },
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Stack
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      className="app-catalogue-page-image"
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      gap: 1,
                      alignItems: "center",
                      "& img": {
                        width: { xs: 30, md: 46 },
                        height: { xs: 30, md: 46 },
                        objectFit: "contain",
                        border: "1px solid",
                        borderColor: "primary.main",
                        borderRadius: "50%",
                      },
                    }}
                  >
                    <Stack
                      sx={{
                        width: "100%",
                        bgcolor: "white",
                        borderRadius: { xs: 4, sm: 300 },
                        boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.5)",
                        pl: { xs: 8.5, sm: 8 },
                        position: "relative",
                        pt: { xs: 1.2, sm: 1 },
                        pb: { xs: 0.8, sm: 0 },
                      }}
                    >
                      <Box
                        className="app-catalogue-page-play-button"
                        sx={{
                          position: "absolute",
                          left: 12,
                          top: { xs: -20, sm: -20 },
                          width: { xs: 50, sm: 46 },
                          height: { xs: 50, sm: 46 },
                          borderRadius: "50%",
                          boxShadow: 5,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          bgcolor: "white",
                        }}
                      >
                        <PlayArrowRoundedIcon
                          sx={{
                            fontSize: { xs: 40, md: 24, lg: 32 },
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
                          fontSize: { xs: 13, md: 14, lg: 16 },
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
                          fontSize: { xs: 11, md: 11, lg: 12 },
                        }}
                      >
                        {projectName}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
      </Stack>
    </Stack>
  );
}
