"use client";

import { useMemo, useState } from "react";
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
    <>
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
    </>
  );
};

export default AppIndex;
