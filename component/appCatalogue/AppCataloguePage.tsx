"use client";

import { Skeleton, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import Navbar from "./component/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
};

export default function AppCataloguePage({
  navigationButtons,
  homeVideos,
  allVideos,
}: AppCataloguePageProps) {
  const router = useRouter();
  const [selectedNav, setSelectedNav] = useState<string>("home");

  const selectedVideos = useMemo(() => {
    if (selectedNav === "home") {
      return homeVideos;
    }

    return allVideos.filter((video) => video.projectId === selectedNav);
  }, [allVideos, homeVideos, selectedNav]);

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

  return (
    <Stack
      sx={{
        gap: 2,
        color: "#fff",
      }}
    >
      {/* NavigationButtons */}
      <Stack
        sx={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          position: "sticky",
          top: 0,
          zIndex: 30,
          py: 1,
          bgcolor: "background.default",
          backdropFilter: "blur(8px)",
          borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
          "&::after": {
            content: '""',
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -12,
            height: 12,
            pointerEvents: "none",
            width: "100%",
            background: (theme) =>
              `linear-gradient(to bottom, ${theme.palette.primary.main}44, transparent)`,
          },
        }}
      >
        {!!navigationButtons.length
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
                    opacity: 1,
                    filter: isSelected ? "none" : "grayscale(100%)",
                    transition: "all 0.3s ease",
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
          : Array(4).map((item, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={100}
                height={100}
              />
            ))}
      </Stack>

      {/* cards */}
      <Stack
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 320px))",
          justifyContent: "center",
        }}
      >
        {selectedVideos.map((item) => {
          const project = projectById.get(item.projectId);
          const projectLogo = project?.image || item.thumbnail;
          const projectName = project?.title || project?.name || "Project";

          return (
            <Stack
              key={item._id}
              onClick={() => {
                console.log("clicked", item._id);
                router.push(`/app/watch/${item._id}`);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/app/watch/${item._id}`);
                }
              }}
              tabIndex={0}
              role="button"
              sx={{
                width: 320,
                pb: 0.5,
                border: (theme) => "1px solid #aaa",
                borderRadius: 2,
                cursor: "pointer",
                overflow: "hidden",
                "&:hover": {
                  boxShadow: (theme) =>
                    `0px 2px 10px 1px ${theme.palette.primary.main}`,
                  "& .app-catalogue-page-image": {
                    transition: "all 0.3s ease",
                    transform: "scale(1.1) rotate(3deg)",
                  },
                },
                transition: "all 0.3s ease",
              }}
            >
              <Stack
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 182,
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
                  pl: 0.8,
                  gap: 1,
                  alignItems: "center",
                  "& img": {
                    objectFit: "contain",
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: "50%",
                  },
                }}
              >
                <Image
                  src={projectLogo}
                  alt={projectName}
                  width={46}
                  height={46}
                  style={{ objectFit: "contain" }}
                />
                <Stack sx={{ width: "100%", overflow: "hidden" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      width: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "text.primary",
                      fontWeight: 700,
                      fontSize: 18,
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
                      fontSize: 12,
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
