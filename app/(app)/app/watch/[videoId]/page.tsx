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
import WatchRelatedRail from "@/component/appCatalogue/watch/WatchRelatedRail";
import WatchPlayerPlayIcon from "@/component/appCatalogue/watch/WatchPlayerPlayIcon";
import { CircularProgress, Skeleton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNativeApp } from "@/lib/capacitor/nativeApp";

const PLAYER_FLEX = 7;
const RAIL_FLEX = 3;

type VideoDetails = {
  title?: string;
  description?: string;
  url?: string;
  projectId?: string;
  episode?: number;
  season?: number;
  thumbnail?: string;
};

type ProjectDetails = {
  _id?: string;
  title?: string;
  name?: string;
  thumbnail?: string;
  description?: string;
};

const WatchPage = () => {
  const params = useParams();
  const isNative = useNativeApp();
  const videoId = params.videoId as string;
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [relatedVideos, setRelatedVideos] = useState<WatchCatalogueVideo[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

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
    if (status !== "ready") {
      setRelatedVideos([]);
      setRelatedLoading(false);
      return;
    }

    let cancelled = false;

    const loadRelatedVideos = async () => {
      setRelatedLoading(true);

      const [allVideosResult, projectPreviews] = await Promise.all([
        fetchPublicAllVideos({ showInHomepageOnly: true }),
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

  const pageHeight = isNative
    ? { xs: "calc(100dvh - 8px)", md: "calc(100dvh - 16px)" }
    : {
        xs: "calc(100dvh - 70px)",
        sm: "calc(100dvh - 70px)",
        md: "calc(100dvh - 35px)",
      };

  return (
    <Stack
      sx={{
        height: '100vh',
        mt: { xs: isNative ? 0 : "60px", md: 0 },
        justifyContent: { xs: "flex-start", sm: "end" },
        alignItems: { xs: "stretch", sm: "end" },
        flexDirection: "column",
        gap: { xs: 0, md: 2 },
        overflow: "hidden",
      }}
    >
      <Stack
        sx={{
          flex: { xs: "0 0 auto", sm: `${PLAYER_FLEX} 1 0` },
          minHeight: { xs: "auto", sm: 0 },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          pb: 1,
          overflow: { xs: "visible", sm: "hidden" },
          px: { xs: 2, md: 0 },
        }}
      >
        <Stack
          sx={{
            flex: { xs: "0 0 auto", sm: 1 },
            minHeight: { xs: "auto", sm: 0 },
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            sx={{
              position: "relative",
              borderRadius: { xs: 4, md: 0 },
              overflow: { xs: "hidden", md: "visible" },
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "stretch",
              width: { xs: "100%", sm: "auto" },
              height: { xs: "auto", sm: "100%" },
              maxHeight: { xs: "none", sm: "100%" },
              maxWidth: { xs: "100%", md: "80%" },
              gap: 1,
            }}
          >
            <Stack
              sx={{
                position: "relative",
                flex: { xs: "0 0 auto", sm: 1 },
                minHeight: { xs: "auto", sm: 0 },
                width: "100%",
                height: { xs: "auto", sm: "100%" },
                maxHeight: { xs: "none", sm: "100%" },
                maxWidth: "100%",
                aspectRatio: "16 / 9",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              {status === "loading" ? (
                <>
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: 4,
                    }}
                  />
                  <Stack
                    sx={{
                      position: "absolute",
                      inset: 0,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress
                      size={100}
                      sx={{ color: "primary.light" }}
                    />
                  </Stack>
                </>
              ) : hasVideoUrl ? (
                <Stack
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    bgcolor: "#eee",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 4,
                    "& .react-player__preview": {
                      position: "relative",
                    },
                  }}
                >
                  <ReactPlayer
                    src={videoUrl}
                    light={
                      videoThumbnail ? (
                        <img
                          src={videoThumbnail}
                          alt={video?.title || "Video"}
                          style={{
                            width: "100%",
                            aspectRatio: "16 / 9",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        true
                      )
                    }
                    playIcon={<WatchPlayerPlayIcon />}
                    previewAriaLabel={`Play ${video?.title || "video"}`}
                    controls
                    width="100%"
                    height="100%"
                    playing
                  />
                </Stack>
              ) : (
                <Stack
                  sx={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "black",
                    px: 2,
                  }}
                >
                  <Typography sx={{ color: "white", textAlign: "center" }}>
                    {status === "error"
                      ? errorMessage
                      : "No video URL was provided for this breakdown."}
                  </Typography>
                </Stack>
              )}
            </Stack>

            <Stack
              sx={{
                // display: { xs: "none", md: "flex" },
                position: { xs: "absolute", md: "relative" },
                backgroundColor: {
                  xs: "rgba(0, 0, 0, 0.3)",
                  md: "transparent",
                },
                px: { xs: 1, md: 0 },
                py: { xs: 2, md: 0 },
                bottom: 0,
                zIndex: 200,
                flexDirection: "row",
                gap: 1,
                height: 40,
                flexShrink: 0,
                alignItems: "center",
                width: "100%",
                "& img": {
                  objectFit: "contain",
                  borderRadius: "50%",
                  border: "1px solid",
                  borderColor: "primary.light",
                  width: { xs: 32, sm: 36, md: 40, lg: 44 },
                  height: { xs: 32, sm: 36, md: 40, lg: 44 },
                },
                "& .episode": {
                  color: { xs: "white", md: "#777" },
                  fontSize: { xs: 12, sm: 14, md: 24, lg: 30 },
                  fontWeight: 500,
                },
                "& .title": {
                  fontSize: { xs: 12, sm: 14, md: 24, lg: 30 },
                  fontWeight: 700,
                  color: { xs: "white", md: "primary.light" },
                },
              }}
            >
              {status === "ready" ? (
                <>
                  {projectLogo ? (
                    <Image
                      src={projectLogo}
                      alt={projectName || "Project"}
                      width={36}
                      height={36}
                    />
                  ) : null}
                  <Typography className="episode">
                    {`S${video?.season}-E${video?.episode} |`}
                  </Typography>

                  <Typography className="title">
                    {video?.title || "Video"}
                  </Typography>
                </>
              ) : (
                <>
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    sx={{
                      width: { xs: 32, sm: 36, md: 40, lg: 44 },
                      height: { xs: 32, sm: 36, md: 40, lg: 44 },
                    }}
                  />
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    sx={{ width: "100%", height: "100%", borderRadius: 2 }}
                  />
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        sx={{
          position: "relative",
          flexShrink: 0,
          width: "100%",
          zIndex: 2,
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
      />

      <Stack
        sx={{
          flex: { xs: "1 1 0", sm: `${RAIL_FLEX} 1 0` },
          minHeight: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <WatchRelatedRail
          isNative={isNative}
          videos={relatedVideos}
          isLoading={relatedLoading || status === "loading"}
        />
      </Stack>
    </Stack>
  );
};

export default WatchPage;
