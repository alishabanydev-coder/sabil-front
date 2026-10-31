import type {
  AdminChannelProjectRecord,
  AdminChannelVideoRecord,
  ConnectedYouTubeChannelRecord,
} from "@/types/admin";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createChannelVideo,
  deleteChannelVideo,
  disconnectYouTubeChannel,
  fetchChannelProjects,
  fetchChannelVideos,
  fetchConnectedYouTubeChannels,
  fetchYouTubeVideoDetails,
  startYouTubeOAuth,
  syncProjectVideosFromYouTube,
  updateChannelVideo,
} from "../services/projectsApi";
import {
  notifyAdminError,
  notifyAdminSuccess,
} from "../snackbar/notifyAdmin";

function normalizeTagList(input: string[] | string | undefined): string[] {
  if (Array.isArray(input)) {
    return Array.from(
      new Set(input.map((t) => String(t).trim()).filter(Boolean))
    );
  }

  if (typeof input === "string") {
    return Array.from(
      new Set(
        input
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );
  }

  return [];
}

export const useAdminChannels = () => {
  const [projects, setProjects] = useState<AdminChannelProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [youtubeChannelId, setYoutubeChannelId] = useState("");
  const [isFetchingYouTube, setIsFetchingYouTube] = useState(false);
  const [connectedYouTubeChannels, setConnectedYouTubeChannels] = useState<
    ConnectedYouTubeChannelRecord[]
  >([]);
  const [isConnectingYouTube, setIsConnectingYouTube] = useState(false);
  const [isSyncingProjectVideos, setIsSyncingProjectVideos] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [videos, setVideos] = useState<AdminChannelVideoRecord[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosErrorMsg, setVideosErrorMsg] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<number | null>(1);
  const [selectedVideo, setSelectedVideo] =
    useState<AdminChannelVideoRecord | null>(null);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState(false);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");
  const [fetchedPosterPath, setFetchedPosterPath] = useState("");
  const [fetchedPosterUrl, setFetchedPosterUrl] = useState("");
  const [fetchedPosterSourceUrl, setFetchedPosterSourceUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const parsedTags = useMemo(() => normalizeTagList(tagsInput), [tagsInput]);

  const videosBySeason = useMemo(
    () =>
      videos.reduce<Record<number, AdminChannelVideoRecord[]>>((groups, video) => {
        const seasonNumber = video.season || 1;

        return {
          ...groups,
          [seasonNumber]: [...(groups[seasonNumber] || []), video],
        };
      }, {}),
    [videos]
  );

  const seasons = useMemo(
    () =>
      Object.keys(videosBySeason)
        .map(Number)
        .sort((a, b) => a - b),
    [videosBySeason]
  );

  const parsedSeason = Number(season);
  const parsedEpisode = Number(episode);

  const episodeAlreadyExists = useMemo(
    () =>
      videos.some(
        (video) =>
          video.season === parsedSeason &&
          video.episode === parsedEpisode &&
          video._id !== selectedVideo?._id &&
          Number.isInteger(parsedSeason) &&
          Number.isInteger(parsedEpisode)
      ),
    [parsedEpisode, parsedSeason, selectedVideo?._id, videos]
  );

  const matchedFetchedPosterPath =
    fetchedPosterPath && fetchedPosterSourceUrl === videoUrl.trim()
      ? fetchedPosterPath
      : "";
  const matchedFetchedPosterUrl = matchedFetchedPosterPath
    ? fetchedPosterUrl
    : "";

  const activeThumbnailPreviewUrl =
    thumbnailPreviewUrl ||
    matchedFetchedPosterUrl ||
    selectedVideo?.thumbnail ||
    "";

  const isSubmitDisabled = useMemo(
    () =>
      isSubmitting ||
      !title.trim() ||
      !videoUrl.trim() ||
      (!thumbnail && !matchedFetchedPosterPath && !selectedVideo?.thumbnail) ||
      !description.trim() ||
      !season ||
      !episode ||
      episodeAlreadyExists,
    [
      description,
      episode,
      episodeAlreadyExists,
      isSubmitting,
      matchedFetchedPosterPath,
      season,
      selectedVideo?.thumbnail,
      thumbnail,
      title,
      videoUrl,
    ]
  );

  const resetForm = useCallback(() => {
    setTitle("");
    setVideoUrl("");
    setThumbnail(null);
    setDescription("");
    setTagsInput("");
    setViewCount(0);
    setLikeCount(0);
    setCommentCount(0);
    setYoutubeVideoId("");
    setYoutubeChannelId("");
    setSeason("");
    setEpisode("");
    setSubmitErrorMsg("");
    setIsEditing(false);
    setPreviewThumbnail(false);
    setFetchedPosterPath("");
    setFetchedPosterUrl("");
    setFetchedPosterSourceUrl("");
    setSelectedVideo(null);
    setIsEditingVideo(false);
    setIsPublished(true);
  }, []);

  const handleSelectedVideo = useCallback((video: AdminChannelVideoRecord) => {
    setSelectedVideo(video);
    setIsEditing(true);
    setIsEditingVideo(true);
    setOpen(true);
    setTitle(video.title);
    setVideoUrl(video.url);
    setThumbnail(null);
    setFetchedPosterPath("");
    setFetchedPosterUrl("");
    setFetchedPosterSourceUrl("");
    setDescription(video.description);
    setTagsInput(Array.isArray(video.tags) ? video.tags.join(", ") : "");
    setViewCount(Number(video.viewCount) || 0);
    setLikeCount(Number(video.likeCount) || 0);
    setCommentCount(Number(video.commentCount) || 0);
    setYoutubeVideoId(video.youtubeVideoId || "");
    setYoutubeChannelId(video.youtubeChannelId || "");
    setSeason(video.season.toString());
    setEpisode(video.episode.toString());
    setIsPublished(video.isPublished !== false);
    setPreviewThumbnail(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
    resetForm();
  }, [resetForm]);

  const handleClose = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm]);

  const loadConnectedYouTubeChannels = useCallback(async () => {
    try {
      const result = await fetchConnectedYouTubeChannels();
      if (result.ok) {
        setConnectedYouTubeChannels(result.channels);
      } else {
        notifyAdminError(
          result.message || "Failed to load connected YouTube channels."
        );
      }
    } catch (error) {
      notifyAdminError(
        error instanceof Error
          ? error.message
          : "Failed to load connected YouTube channels."
      );
    }
  }, []);

  const handleConnectYouTube = useCallback(async () => {
    setIsConnectingYouTube(true);

    try {
      const result = await startYouTubeOAuth();
      if (!result.ok || !result.authUrl) {
        notifyAdminError(
          result.message || "Failed to start YouTube connection."
        );
        return;
      }

      const width = 560;
      const height = 680;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        result.authUrl,
        "ConnectYouTubeOAuth",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );
      notifyAdminSuccess("Google sign-in opened. Finish connecting in the popup.");
    } catch (error) {
      notifyAdminError(
        error instanceof Error
          ? error.message
          : "Failed to start YouTube connection."
      );
    } finally {
      setIsConnectingYouTube(false);
    }
  }, []);

  const handleDisconnectYouTubeChannel = useCallback(
    async (channelId: string) => {
      try {
        const result = await disconnectYouTubeChannel(channelId);
        if (!result.ok) {
          notifyAdminError(
            result.message || "Failed to disconnect YouTube channel."
          );
          return;
        }

        setConnectedYouTubeChannels((current) =>
          current.filter((ch) => ch.youtubeChannelId !== channelId)
        );
        notifyAdminSuccess(result.message || "YouTube channel disconnected.");
      } catch (error) {
        notifyAdminError(
          error instanceof Error
            ? error.message
            : "Failed to disconnect YouTube channel."
        );
      }
    },
    []
  );

  const handleFetchFromYouTube = useCallback(async () => {
    if (!videoUrl.trim()) {
      notifyAdminError("Please enter a YouTube video URL first.");
      return;
    }

    setIsFetchingYouTube(true);

    try {
      const sourceUrl = videoUrl.trim();
      const result = await fetchYouTubeVideoDetails(sourceUrl, {
        previousPoster: fetchedPosterPath,
      });
      if (!result.ok || !result.videoDetails) {
        notifyAdminError(
          result.message || "Failed to fetch video details from YouTube."
        );
        return;
      }

      const details = result.videoDetails;
      if (details.title) {
        setTitle(details.title.slice(0, 180));
      }
      if (details.description) {
        setDescription(details.description);
      }
      if (Array.isArray(details.tags)) {
        setTagsInput(details.tags.join(", "));
      }
      setViewCount(Number(details.viewCount) || 0);
      setLikeCount(Number(details.likeCount) || 0);
      setCommentCount(Number(details.commentCount) || 0);
      setYoutubeVideoId(details.youtubeVideoId || "");
      setYoutubeChannelId(details.youtubeChannelId || "");
      if (details.thumbnailPath) {
        setThumbnail(null);
        setFetchedPosterPath(details.thumbnailPath);
        setFetchedPosterUrl(details.thumbnail || "");
        setFetchedPosterSourceUrl(sourceUrl);
      }

      const tagCount = Array.isArray(details.tags) ? details.tags.length : 0;
      const ownerNote = details.matchedOwnerChannel
        ? `Fetched from "${details.youtubeChannelTitle}" (${tagCount} tag(s)).`
        : `Fetched public details from "${details.youtubeChannelTitle}". Connect this video's channel to also fetch private tags.`;
      const posterNote = details.thumbnailPath
        ? " Poster saved as WebP."
        : details.posterError
          ? ` Poster was not saved (${details.posterError}).`
          : "";
      notifyAdminSuccess(`${ownerNote}${posterNote}`);
    } catch (error) {
      notifyAdminError(
        error instanceof Error
          ? error.message
          : "Failed to fetch video details from YouTube."
      );
    } finally {
      setIsFetchingYouTube(false);
    }
  }, [fetchedPosterPath, videoUrl]);

  const handleSyncProjectVideosFromYouTube = useCallback(async () => {
    if (!selectedProject) {
      notifyAdminError("Please select a project first.");
      return;
    }

    setIsSyncingProjectVideos(true);

    try {
      const result = await syncProjectVideosFromYouTube(selectedProject);
      if (!result.ok) {
        notifyAdminError(
          result.message || "Failed to sync project videos from YouTube."
        );
        return;
      }

      if (Array.isArray(result.videos)) {
        setVideos(result.videos);
      }
      notifyAdminSuccess(
        result.message || "Synced project videos from YouTube."
      );
    } catch (error) {
      notifyAdminError(
        error instanceof Error
          ? error.message
          : "Failed to sync project videos from YouTube."
      );
    } finally {
      setIsSyncingProjectVideos(false);
    }
  }, [selectedProject]);

  const handleSubmit = useCallback(async () => {
    if (!selectedProject) {
      const message = "Please select a project first.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMsg("");

    if (episodeAlreadyExists) {
      const message = `Season ${parsedSeason}, episode ${parsedEpisode} already exists.`;
      setSubmitErrorMsg(message);
      notifyAdminError(message);
      setIsSubmitting(false);
      return;
    }

    try {
      const videoPayload = {
        title: title.trim(),
        url: videoUrl.trim(),
        thumbnail:
          thumbnail || matchedFetchedPosterPath || selectedVideo?.thumbnail,
        description: description.trim(),
        season: Number(season),
        episode: Number(episode),
        isPublished,
        tags: parsedTags,
        viewCount,
        likeCount,
        commentCount,
        youtubeVideoId,
        youtubeChannelId,
      };
      const result =
        isEditingVideo && selectedVideo
          ? await updateChannelVideo(
              selectedProject,
              selectedVideo._id,
              videoPayload
            )
          : await createChannelVideo(selectedProject, videoPayload);

      if (!result.ok) {
        const message = result.message || "Failed to save video.";
        setSubmitErrorMsg(message);
        notifyAdminError(message);
        return;
      }

      if (result.video) {
        setVideos((currentVideos) =>
          [
            ...currentVideos.filter((video) => video._id !== result.video?._id),
            result.video,
          ].sort(
            (firstVideo, secondVideo) =>
              firstVideo.season - secondVideo.season ||
              firstVideo.episode - secondVideo.episode
          )
        );
      }

      notifyAdminSuccess(isEditingVideo ? "Video updated." : "Video added.");
      handleClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create video.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    commentCount,
    description,
    episode,
    episodeAlreadyExists,
    handleClose,
    isEditingVideo,
    isPublished,
    likeCount,
    matchedFetchedPosterPath,
    parsedEpisode,
    parsedSeason,
    parsedTags,
    season,
    selectedProject,
    selectedVideo,
    thumbnail,
    title,
    videoUrl,
    viewCount,
    youtubeChannelId,
    youtubeVideoId,
  ]);

  const handleDelete = useCallback(async () => {
    if (!selectedProject) {
      const message = "Please select a project first.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
      return;
    }

    if (!selectedVideo) {
      const message = "Please select a video first.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMsg("");

    try {
      const result = await deleteChannelVideo(
        selectedProject,
        selectedVideo._id
      );

      if (!result.ok) {
        const message = result.message || "Failed to delete video.";
        setSubmitErrorMsg(message);
        notifyAdminError(message);
        return;
      }

      setVideos((currentVideos) =>
        currentVideos.filter((video) => video._id !== selectedVideo._id)
      );
      notifyAdminSuccess("Video deleted.");
      handleClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete video.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [handleClose, selectedProject, selectedVideo]);

  const handleSelectProject = useCallback((projectId: string | null) => {
    setSelectedProject(projectId);
  }, []);

  const handleToggleSeason = useCallback((seasonNumber: number) => {
    setSelectedSeason((currentSeason) =>
      currentSeason === seasonNumber ? null : seasonNumber
    );
  }, []);

  useEffect(() => {
    loadConnectedYouTubeChannels();

    const handleMessage = (event: MessageEvent) => {
      const payload = event?.data;
      if (!payload || payload.type !== "YOUTUBE_OAUTH_RESULT") {
        return;
      }

      if (payload.ok) {
        notifyAdminSuccess(
          payload.message || `Connected YouTube channel "${payload.title}".`
        );
        loadConnectedYouTubeChannels();
      } else {
        notifyAdminError(
          payload.message || "Failed to connect YouTube channel."
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [loadConnectedYouTubeChannels]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await fetchChannelProjects({
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);

        if (!result.ok) {
          setErrorMsg(result.message);
          notifyAdminError(result.message || "Failed to load projects.");
          return;
        }

        setProjects(result.projects);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        const message =
          error instanceof Error ? error.message : "Failed to load projects.";
        setErrorMsg(message);
        notifyAdminError(message);
      }
    }

    loadProjects();

    return () => controller.abort("Channels tab unmounted");
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      setVideos([]);
      setVideosErrorMsg("");
      setVideosLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadVideos() {
      setVideosLoading(true);
      setVideosErrorMsg("");

      try {
        const result = await fetchChannelVideos(selectedProject, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setVideosLoading(false);

        if (!result.ok) {
          setVideos([]);
          setVideosErrorMsg(result.message);
          notifyAdminError(result.message || "Failed to load videos.");
          return;
        }

        setVideos(result.videos);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setVideos([]);
        setVideosLoading(false);
        const message =
          error instanceof Error ? error.message : "Failed to load videos.";
        setVideosErrorMsg(message);
        notifyAdminError(message);
      }
    }

    loadVideos();

    return () => controller.abort("Selected project changed");
  }, [selectedProject]);

  useEffect(() => {
    if (!thumbnail) {
      setThumbnailPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(thumbnail);
    setThumbnailPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnail]);

  return {
    activeThumbnailPreviewUrl,
    commentCount,
    connectedYouTubeChannels,
    description,
    episode,
    episodeAlreadyExists,
    errorMsg,
    handleClose,
    handleConnectYouTube,
    handleDelete,
    handleDisconnectYouTubeChannel,
    handleFetchFromYouTube,
    handleOpen,
    handleSelectProject,
    handleSelectedVideo,
    handleSubmit,
    handleSyncProjectVideosFromYouTube,
    handleToggleSeason,
    isConnectingYouTube,
    isEditing,
    isEditingVideo,
    isFetchingYouTube,
    isPublished,
    isSubmitDisabled,
    isSubmitting,
    isSyncingProjectVideos,
    likeCount,
    loading,
    hasFetchedPoster: Boolean(matchedFetchedPosterPath),
    open,
    parsedEpisode,
    parsedSeason,
    parsedTags,
    previewThumbnail,
    projects,
    season,
    seasons,
    selectedProject,
    selectedSeason,
    selectedVideo,
    setDescription,
    setEpisode,
    setIsPublished,
    setPreviewThumbnail,
    setSeason,
    setTagsInput,
    setThumbnail,
    setTitle,
    setVideoUrl,
    submitErrorMsg,
    tagsInput,
    thumbnail,
    title,
    videoUrl,
    videosBySeason,
    videosErrorMsg,
    videosLoading,
    viewCount,
  };
};
