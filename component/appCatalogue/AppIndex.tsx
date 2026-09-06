"use client";

import { useMemo, useState } from "react";
import { Stack } from "@mui/material";
import AppCataloguePage from "./component/AppCataloguePage";
import AppCatalogueCapacitor from "./component/AppCatalogueCapacitor";
import Navbar from "./component/Navbar";
import { useAppDisplayMode } from "@/lib/useAppDisplayMode";

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

const APP_GRADIENT =
  "linear-gradient(to top, #8acbfa 0%, #8acbfa 10%, transparent 100%)";

const AppIndex = ({
  navigationButtons,
  homeVideos,
  suggestedVideos,
  featuredByProjectId,
  allVideos,
}: {
  navigationButtons: NavigationButtonData[];
  homeVideos: VideoData[];
  suggestedVideos: VideoData[];
  featuredByProjectId: Record<string, VideoData[]>;
  allVideos: VideoData[];
}) => {
  const [selectedNav, setSelectedNav] = useState<string>("home");
  const displayMode = useAppDisplayMode();

  const selectedVideos = useMemo(() => {
    if (selectedNav === "home") {
      return homeVideos;
    }

    return allVideos.filter((video) => video.projectId === selectedNav);
  }, [allVideos, homeVideos, selectedNav]);

  const featuredVideos = useMemo(
    () =>
      selectedNav === "home" ? [] : featuredByProjectId[selectedNav] || [],
    [featuredByProjectId, selectedNav]
  );

  const catalogueProps = {
    navigationButtons,
    selectedVideos,
    homeVideos,
    suggestedVideos,
    featuredVideos,
    allVideos,
    selectedNav,
  };

  if (displayMode === "pending") {
    return (
      <Stack
        aria-hidden
        sx={{
          width: "100%",
          height: "100dvh",
          overflow: "hidden",
          bgcolor: "#12041f",
        }}
      />
    );
  }

  const isNative = displayMode === "native";
  const isMobile = displayMode === "mobile";

  return (
    <Stack
      sx={{
        width: "100%",
        height: isNative ? "100%" : isMobile ? "100dvh" : "auto",
        overflow: isNative || isMobile ? "hidden" : "visible",
        backgroundImage: isNative || isMobile ? APP_GRADIENT : "none",
      }}
    >
      <Navbar
        displayMode={displayMode}
        navigationButtons={navigationButtons}
        selectedNav={selectedNav}
        setSelectedNav={setSelectedNav}
        allVideos={allVideos}
        suggestedVideos={suggestedVideos}
      />

      {isNative ? (
        <AppCatalogueCapacitor {...catalogueProps} />
      ) : (
        <AppCataloguePage {...catalogueProps} />
      )}
    </Stack>
  );
};

export default AppIndex;
