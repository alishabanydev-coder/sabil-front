"use client";

import { Skeleton, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import Navbar from "./component/Navbar";
import Image from "next/image";

type ProjectData = {
  _id: string;
  name: string;
  title: string;
  thumbnail: string;
  description: string;
};

type CatalogueData = {
  _id: string;
  projectId: string;
  header: string;
  body: string;
  image: string;
};

type VideoData = {
  _id: string;
  projectId: string;
  title: string;
  thumbnail: string;
  season?: number;
  episode?: number;
};

type AppCataloguePageProps = {
  projects: ProjectData[];
  catalogues: CatalogueData[];
  videos: VideoData[];
};

export default function AppCataloguePage({
  projects,
  videos,
}: AppCataloguePageProps) {
  const [selectedProject, setSelectedProject] = useState<string>("");

  const projectById = useMemo(
    () => new Map(projects.map((project) => [project._id, project])),
    [projects]
  );

  return (
    <Stack
      sx={{
        direction: "ltr",
        minHeight: "100dvh",
        width: "100%",
        px: { xs: 2, md: 0 },
        py: { xs: 2, md: 2 },
        gap: 2,
        color: "#fff",
      }}
    >
      {/* Navbar */}
      <Navbar isApp={true} />

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
        {!!projects.length
          ? projects.map((item) => {
              const isSelected = selectedProject === item._id;
              return (
                <Stack
                  key={item._id}
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
                    setSelectedProject(item._id);
                  }}
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
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
        {videos.map((item) => {
          const project = projectById.get(item.projectId);
          const projectLogo = project?.thumbnail || item.thumbnail;
          const projectName = project?.title || project?.name || "Project";

          return (
            <Stack
              key={item._id}
              sx={{
                width: 320,
                height: 235,
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
