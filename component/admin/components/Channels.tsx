"use client";

import {
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  createChannelVideo,
  fetchChannelProjects,
  fetchChannelVideos,
  updateChannelVideo,
} from "../services/projectsApi";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface ProjectRecord {
  _id: string;
  id: string;
  name: string;
  thumbnail: string;
}

interface VideoRecord {
  _id: string;
  id?: string;
  title: string;
  url: string;
  thumbnail: string;
  description: string;
  season: number;
  episode: number;
}

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "80vh",
  width: 380,
  position: "absolute",
  flexDirection: "row",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  gap: 2,
};

const Channels = () => {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
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
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosErrorMsg, setVideosErrorMsg] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState(false);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");

  const videosBySeason = videos.reduce<Record<number, VideoRecord[]>>(
    (groups, video) => {
      const seasonNumber = video.season || 1;

      return {
        ...groups,
        [seasonNumber]: [...(groups[seasonNumber] || []), video],
      };
    },
    {}
  );
  const seasons = Object.keys(videosBySeason)
    .map(Number)
    .sort((a, b) => a - b);
  const parsedSeason = Number(season);
  const parsedEpisode = Number(episode);
  const episodeAlreadyExists = videos.some(
    (video) =>
      video.season === parsedSeason &&
      video.episode === parsedEpisode &&
      video._id !== selectedVideo?._id &&
      Number.isInteger(parsedSeason) &&
      Number.isInteger(parsedEpisode)
  );
  const activeThumbnailPreviewUrl =
    thumbnailPreviewUrl || selectedVideo?.thumbnail || "";

  const handleSelectedVideo = (video: VideoRecord) => {
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
    setPreviewThumbnail(false);
  };

  const handleOpen = () => {
    setOpen(true);
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
  };

  const handleClose = () => {
    setOpen(false);
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
  };

  const handleSubmit = async () => {
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
  };

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

  return (
    <>
      <Stack sx={{ gap: 3, height: "100%" }}>
        <Stack sx={{ gap: 0.5, width: "100%", height: "115px" }}>
          <Stack direction="row" sx={{ gap: 0.5 }}>
            <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
              Channels
            </Typography>

            <Stack
              direction="row"
              sx={{
                gap: 2,
                flexWrap: "wrap",
                width: "90%",
                justifyContent: "space-between",
                alignItems: "center",
                border: (theme) => `1px solid ${theme.palette.primary.dark}`,
                borderRadius: 2,
                mx: "auto",
                p: 2,
                overflow: "auto",
                overflowX: "auto",
              }}
            >
              {loading ? (
                <CircularProgress size={28} />
              ) : errorMsg ? (
                <Typography color="error" variant="body2">
                  {errorMsg}
                </Typography>
              ) : projects.length === 0 ? (
                <Typography color="text.secondary" variant="body2">
                  No project access assigned.
                </Typography>
              ) : (
                <Stack
                  direction="row"
                  sx={{
                    width: "100%",
                    gap: 6,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {projects.map((project) => (
                    <img
                      key={project._id}
                      src={project.thumbnail}
                      alt={project.name}
                      style={{
                        width: "auto",
                        height: "80px",
                        cursor: "pointer",
                        filter:
                          selectedProject === project._id
                            ? "none"
                            : "grayscale(100%)",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => {
                        setSelectedProject(project._id || project.id || null);
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            height: "100%",
            border: (theme) => `1px solid ${theme.palette.primary.dark}`,
            borderRadius: 2,
            p: 2,
            position: "relative",
          }}
        >
          <Stack
            sx={{
              height: "100%",
              position: "absolute",
              top: -20,
              right: 0,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={selectedProject === null}
              onClick={handleOpen}
              sx={{
                width: 200,
                boxShadow: (theme) =>
                  `0px 2px 12px 1px ${theme.palette.primary.main}`,
                "&:disabled": {
                  backgroundColor: "grey.500",
                  color: "white",
                },
              }}
            >
              Add Video +
            </Button>

            {!selectedProject ? (
              <Typography color="text.secondary" variant="body2">
                Select a project to view videos.
              </Typography>
            ) : videosLoading ? (
              <CircularProgress size={28} />
            ) : videosErrorMsg ? (
              <Typography color="error" variant="body2">
                {videosErrorMsg}
              </Typography>
            ) : seasons.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                No videos uploaded for this project.
              </Typography>
            ) : (
              <Stack sx={{ width: "100%", gap: 3, overflow: "auto", pt: 1 }}>
                {seasons.map((season) => (
                  <Stack
                    key={season}
                    sx={{
                      width: "100%",
                      alignItems: "center",
                      gap: 1.5,
                      textAlign: "center",
                    }}
                  >
                    <Divider flexItem sx={{ width: "100%" }}>
                      <Stack
                        component={motion.div}
                        direction="row"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setSelectedSeason(
                            selectedSeason === season ? null : season
                          )
                        }
                        sx={{
                          gap: 1,
                          alignItems: "center",
                          px: 2,
                          py: 0.75,
                          borderRadius: 999,
                          cursor: "pointer",
                        }}
                      >
                        <Typography
                          color={
                            selectedSeason !== season ? "common.white" : "error"
                          }
                          variant="body2"
                          sx={{ fontWeight: 700 }}
                        >
                          Season {season}
                        </Typography>

                        <IconButton size="small">
                          <motion.span
                            animate={{
                              rotate: selectedSeason === season ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            style={{ display: "flex" }}
                          >
                            {selectedSeason === season ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </motion.span>
                        </IconButton>
                      </Stack>
                    </Divider>
                    <AnimatePresence initial={false}>
                      {selectedSeason === season && (
                        <Stack
                          component={motion.div}
                          key={`season-${season}-videos`}
                          direction="row"
                          initial={{ height: 0, opacity: 0, y: -10 }}
                          animate={{ height: "auto", opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -10 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          sx={{
                            gap: 2,
                            flexWrap: "wrap",
                            justifyContent: "center",
                            overflow: "hidden",
                            py: 1,
                          }}
                        >
                          {videosBySeason[season].map((video, index) => (
                            <Stack
                              component={motion.div}
                              onClick={() => {
                                handleSelectedVideo(video);
                              }}
                              key={video._id || video.id}
                              initial={{ opacity: 0, y: 16, scale: 0.94 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{
                                delay: index * 0.04,
                                duration: 0.22,
                              }}
                              whileHover={{ y: -6, scale: 1.04 }}
                              sx={{
                                width: 180,
                                gap: 1,
                                alignItems: "center",
                                textAlign: "center",
                                p: 1,
                                cursor: "pointer",
                                borderRadius: 2,
                                backgroundColor: "background.paper",
                                boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                              }}
                            >
                              <Stack
                                direction="row"
                                sx={{
                                  gap: 1,
                                  alignItems: "center",
                                  width: "100%",
                                  overflow: "hidden",
                                  aspectRatio: "16 / 9",
                                }}
                              >
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                  }}
                                />
                              </Stack>
                              <Typography variant="body2">
                                {`${video.episode.toString().padStart(2, "0")} - ${video.title}`}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </AnimatePresence>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack sx={style}>
          <Stack sx={{ width: "100%", gap: 2 }}>
            <Typography
              component="h2"
              sx={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}
            >
              {isEditing ? "Edit Video" : "Add Video"}
            </Typography>

            <TextField
              variant="standard"
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
              placeholder="Enter title"
            />

            <TextField
              variant="standard"
              label="Video URL"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              fullWidth
              placeholder="Enter video url"
            />

            <ButtonGroup size="small" aria-label="Thumbnail actions">
              <Button
                component="label"
                variant={
                  thumbnail || selectedVideo?.thumbnail
                    ? "contained"
                    : "outlined"
                }
                color="primary"
              >
                {thumbnail
                  ? thumbnail.name
                  : isEditingVideo
                    ? "Change Thumbnail"
                    : "Select Thumbnail"}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setThumbnail(event.target.files?.[0] ?? null);
                  }}
                />
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!activeThumbnailPreviewUrl}
                onClick={() => {
                  setPreviewThumbnail(true);
                }}
              >
                Preview Thumbnail
              </Button>
            </ButtonGroup>

            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
              multiline
              rows={4}
              placeholder="Enter description"
            />
            <Stack direction={"row"} sx={{ gap: 2 }}>
              <TextField
                label="Season"
                type="number"
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                fullWidth
                placeholder="Enter season"
                sx={{ direction: "ltr" }}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    step: 1,
                  },
                }}
              />
              <TextField
                label="Episode"
                type="number"
                value={episode}
                onChange={(event) => setEpisode(event.target.value)}
                error={episodeAlreadyExists}
                helperText={
                  episodeAlreadyExists
                    ? `Season ${parsedSeason}, episode ${parsedEpisode} already exists.`
                    : ""
                }
                fullWidth
                placeholder="Enter episode"
                sx={{ direction: "ltr" }}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    step: 1,
                  },
                }}
              />
            </Stack>

            <Stack
              direction="row"
              sx={{
                gap: 2,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                disabled={
                  isSubmitting ||
                  !title.trim() ||
                  !videoUrl.trim() ||
                  (!thumbnail && !selectedVideo?.thumbnail) ||
                  !description.trim() ||
                  !season ||
                  !episode ||
                  episodeAlreadyExists
                }
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {isSubmitting ? "Uploading..." : "Submit"}
              </Button>

              <Button onClick={handleClose} variant="outlined" color="primary">
                Cancel
              </Button>
            </Stack>
            <Stack
              sx={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {submitErrorMsg ? (
                <Typography color="error" variant="body2">
                  {submitErrorMsg}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      </Modal>

      <Modal
        open={previewThumbnail}
        onClose={() => setPreviewThumbnail(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack
          sx={{
            ...style,
            width: "80%",
            alignItems: "center",
            backgroundColor: "",
            boxShadow: 0,
            p: 0,
          }}
        >
          {activeThumbnailPreviewUrl ? (
            <img
              src={activeThumbnailPreviewUrl}
              alt="Preview Thumbnail"
              style={{
                width: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          ) : (
            <Typography color="text.secondary" variant="body2">
              No thumbnail selected.
            </Typography>
          )}
        </Stack>
      </Modal>
    </>
  );
};

export default Channels;
