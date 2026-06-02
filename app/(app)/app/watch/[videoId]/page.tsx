"use client";

import { fetchPublicVideoById } from "@/component/appCatalogue/services/appCatalogueApi";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

type VideoDetails = {
  title?: string;
  description?: string;
  url?: string;
};

type ProjectDetails = {
  title?: string;
  name?: string;
  description?: string;
};

const WatchPage = () => {
  const params = useParams();
  const videoId = params.videoId as string;
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

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

  const videoUrl = typeof video?.url === "string" ? video.url.trim() : "";
  const hasVideoUrl = videoUrl.length > 0;
  const projectName = project?.title || project?.name;

  console.log(typeof videoId)

  return (
    <Stack
      sx={{
        height: "calc(100vh - 100px)",
        gap: 2,
        overflow: "hidden",
      }}
    >
      <Stack
        sx={{
          width: "70%",
          aspectRatio: "16 / 9",
          flexShrink: 0,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "black",
          mx: 'auto',
        }}
      >
        {status === "loading" ? (
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "white" }} />
          </Stack>
        ) : hasVideoUrl ? (
          <ReactPlayer
            src={videoUrl}
            controls
            width="100%"
            height="100%"
            playing
          />
        ) : (
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
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
      <Stack sx={{ flex: 1, minHeight: 0, gap: 1, overflowY: "auto" }}>
        {status === "ready" && (
          <>
            {projectName ? (
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}
              >
                {projectName}
              </Typography>
            ) : null}
            <Typography
              sx={{ fontSize: 20, fontWeight: 700, color: "primary.main" }}
            >
              {video?.title || "Video"}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {video?.description || project?.description || ""}
            </Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default WatchPage;
