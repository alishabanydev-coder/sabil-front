"use client";

import { useMemo, useState } from "react";
import { Stack } from "@mui/material";
import AppCataloguePage from "./component/AppCataloguePage";
import Navbar from "./component/Navbar";

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

const AppIndex = ({
  navigationButtons,
  homeVideos,
  allVideos,
}: {
  navigationButtons: NavigationButtonData[];
  homeVideos: VideoData[];
  allVideos: VideoData[];
}) => {
  const [selectedNav, setSelectedNav] = useState<string>("home");

  const selectedVideos = useMemo(() => {
    if (selectedNav === "home") {
      return homeVideos;
    }

    return allVideos.filter((video) => video.projectId === selectedNav);
  }, [allVideos, homeVideos, selectedNav]);

  return (
    <Stack
      sx={{
        height: { xs: "100dvh", sm: "auto" },
        overflow: { xs: "hidden", sm: "visible" },
        backgroundImage: {
          xs: "linear-gradient(to top, #8acbfa 0%, #8acbfa 10%, transparent 100%)",
          sm: "none",
        },
      }}
    >
      <Navbar
        navigationButtons={navigationButtons}
        selectedNav={selectedNav}
        setSelectedNav={setSelectedNav}
        allVideos={allVideos}
      />

      <AppCataloguePage
        navigationButtons={navigationButtons}
        selectedVideos={selectedVideos}
        homeVideos={homeVideos}
        allVideos={allVideos}
      />
    </Stack>
  );
};

export default AppIndex;
