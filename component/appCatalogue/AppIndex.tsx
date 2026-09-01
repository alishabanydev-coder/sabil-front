"use client";

import { useMemo, useState } from "react";
import { Stack } from "@mui/material";
import AppCataloguePage from "./component/AppCataloguePage";
import AppCatalogueCapacitor from "./component/AppCatalogueCapacitor";
import Navbar from "./component/Navbar";
import { useNativeApp } from "@/lib/capacitor/nativeApp";

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
  const isNative = useNativeApp();

  const selectedVideos = useMemo(() => {
    if (selectedNav === "home") {
      return homeVideos;
    }

    return allVideos.filter((video) => video.projectId === selectedNav);
  }, [allVideos, homeVideos, selectedNav]);

  const catalogueProps = {
    navigationButtons,
    selectedVideos,
    homeVideos,
    allVideos,
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: isNative ? "100%" : { xs: "100dvh", sm: "auto" },
        overflow: isNative ? "hidden" : { xs: "hidden", sm: "visible" },
        backgroundImage: isNative
          ? "linear-gradient(to top, #8acbfa 0%, #8acbfa 10%, transparent 100%)"
          : {
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

      {isNative ? (
        <AppCatalogueCapacitor {...catalogueProps} />
      ) : (
        <AppCataloguePage {...catalogueProps} />
      )}
    </Stack>
  );
};

export default AppIndex;
