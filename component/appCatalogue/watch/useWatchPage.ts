"use client";

import {
  fetchPublicAllVideos,
  fetchPublicProjectPreviews,
  fetchPublicVideoById,
} from "@/component/appCatalogue/services/appCatalogueApi";
import {
  buildWatchRelatedVideos,
  type WatchCatalogueVideo,
} from "@/component/appCatalogue/watch/buildWatchRelatedVideos";
import {
  enrichWatchRelatedVideos,
  type ProjectPreviewMap,
} from "@/component/appCatalogue/watch/enrichWatchRelatedVideos";
import { useEffect, useState } from "react";
import type {
  ProjectDetails,
  VideoDetails,
  WatchPageViewModel,
} from "./watchPageTypes";

export function useWatchPage(videoId: string): WatchPageViewModel {
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [relatedVideos, setRelatedVideos] = useState<WatchCatalogueVideo[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [playerStarted, setPlayerStarted] = useState(false);
  const [nativeBelowShift, setNativeBelowShift] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadVideo = async () => {
      setStatus("loading");
      setErrorMessage("");
      setVideo(null);
      setProject(null);

      const result = await fetchPublicVideoById(videoId);

      if (cancelled) {
        return;
      }

      if (!result.ok || !result.video) {
        setStatus("error");
        setErrorMessage(result.message || "Failed to load video.");
        return;
      }

      setVideo(result.video);
      setProject(result.project);
      setStatus("ready");
    };

    void loadVideo();

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  useEffect(() => {
    setPlayerStarted(false);
    setNativeBelowShift(0);
  }, [videoId]);

  useEffect(() => {
    if (status !== "ready") {
      setRelatedVideos([]);
      setRelatedLoading(false);
      return;
    }

    let cancelled = false;

    const loadRelatedVideos = async () => {
      setRelatedLoading(true);

      const [allVideosResult, projectPreviews] = await Promise.all([
        fetchPublicAllVideos(),
        fetchPublicProjectPreviews(),
      ]);

      if (cancelled) {
        return;
      }

      if (!allVideosResult.ok) {
        setRelatedVideos([]);
        setRelatedLoading(false);
        return;
      }

      const projectId =
        (typeof video?.projectId === "string" ? video.projectId.trim() : "") ||
        (typeof project?._id === "string" ? project._id.trim() : "");

      const related = enrichWatchRelatedVideos(
        buildWatchRelatedVideos({
          allVideos: allVideosResult.videos as WatchCatalogueVideo[],
          currentVideoId: videoId,
          projectId: projectId || null,
        }),
        projectPreviews as ProjectPreviewMap,
        {
          id: projectId,
          logo:
            typeof project?.thumbnail === "string"
              ? project.thumbnail.trim()
              : "",
          name: project?.title || project?.name || "",
        }
      );

      setRelatedVideos(related);
      setRelatedLoading(false);
    };

    void loadRelatedVideos();

    return () => {
      cancelled = true;
    };
  }, [
    status,
    videoId,
    video?.projectId,
    project?._id,
    project?.thumbnail,
    project?.title,
    project?.name,
  ]);

  const videoUrl = typeof video?.url === "string" ? video.url.trim() : "";
  const hasVideoUrl = videoUrl.length > 0;
  const videoThumbnail =
    typeof video?.thumbnail === "string" ? video.thumbnail.trim() : "";
  const projectName = project?.title || project?.name;
  const projectLogo = project?.thumbnail;

  return {
    video,
    status,
    errorMessage,
    relatedVideos,
    relatedLoading,
    videoUrl,
    hasVideoUrl,
    videoThumbnail,
    projectName,
    projectLogo,
    playerStarted,
    nativeBelowShift,
    setPlayerStarted,
    setNativeBelowShift,
  };
}
