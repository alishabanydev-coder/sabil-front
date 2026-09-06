import type {
  AdminChannelProjectRecord,
  AdminChannelVideoRecord,
} from "@/types/admin";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createChannelVideo,
  deleteChannelVideo,
  fetchChannelProjects,
  fetchChannelVideos,
  updateChannelVideo,
} from "../services/projectsApi";

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
  const [isPublished, setIsPublished] = useState(true);

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

  const activeThumbnailPreviewUrl =
    thumbnailPreviewUrl || selectedVideo?.thumbnail || "";

  const isSubmitDisabled = useMemo(
    () =>
      isSubmitting ||
      !title.trim() ||
      !videoUrl.trim() ||
      (!thumbnail && !selectedVideo?.thumbnail) ||
      !description.trim() ||
      !season ||
      !episode ||
      episodeAlreadyExists,
    [
      description,
      episode,
      episodeAlreadyExists,
      isSubmitting,
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
    setSeason("");
    setEpisode("");
    setSubmitErrorMsg("");
    setIsEditing(false);
    setPreviewThumbnail(false);
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
    setDescription(video.description);
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

  const handleSubmit = useCallback(async () => {
    if (!selectedProject) {
      setSubmitErrorMsg("Please select a project first.");
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMsg("");

    if (episodeAlreadyExists) {
      setSubmitErrorMsg(
        `Season ${parsedSeason}, episode ${parsedEpisode} already exists.`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const videoPayload = {
        title: title.trim(),
        url: videoUrl.trim(),
        thumbnail: thumbnail || selectedVideo?.thumbnail,
        description: description.trim(),
        season: Number(season),
        episode: Number(episode),
        isPublished,
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
        setSubmitErrorMsg(result.message);
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

      handleClose();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to create video."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    description,
    episode,
    episodeAlreadyExists,
    handleClose,
    isEditingVideo,
    isPublished,
    parsedEpisode,
    parsedSeason,
    season,
    selectedProject,
    selectedVideo,
    thumbnail,
    title,
    videoUrl,
  ]);

  const handleDelete = useCallback(async () => {
    if (!selectedProject) {
      setSubmitErrorMsg("Please select a project first.");
      return;
    }

    if (!selectedVideo) {
      setSubmitErrorMsg("Please select a video first.");
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
        setSubmitErrorMsg(result.message);
        return;
      }

      setVideos((currentVideos) =>
        currentVideos.filter((video) => video._id !== selectedVideo._id)
      );
      handleClose();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to delete video."
      );
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
          return;
        }

        setProjects(result.projects);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load projects."
        );
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
          return;
        }

        setVideos(result.videos);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setVideos([]);
        setVideosLoading(false);
        setVideosErrorMsg(
          error instanceof Error ? error.message : "Failed to load videos."
        );
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
    description,
    episode,
    episodeAlreadyExists,
    errorMsg,
    handleClose,
    handleDelete,
    handleOpen,
    handleSelectProject,
    handleSelectedVideo,
    handleSubmit,
    handleToggleSeason,
    isEditing,
    isEditingVideo,
    isPublished,
    isSubmitDisabled,
    isSubmitting,
    loading,
    open,
    parsedEpisode,
    parsedSeason,
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
    setThumbnail,
    setTitle,
    setVideoUrl,
    submitErrorMsg,
    thumbnail,
    title,
    videoUrl,
    videosBySeason,
    videosErrorMsg,
    videosLoading,
  };
};
