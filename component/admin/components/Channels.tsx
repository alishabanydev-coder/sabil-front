"use client";

import {
  Button,
  CircularProgress,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { fetchProjects } from "../services/projectsApi";

type ProjectRecord = {
  _id?: string;
  id?: string;
  name?: string;
  thumbnail?: string;
};

type PlyrInstance = {
  destroy: () => void;
};

type PlyrConstructor = new (
  target: HTMLElement,
  options?: { controls?: string[] }
) => PlyrInstance;

const style = {
  height: "auto",
  maxHeight: "80vh",
  width: "80vw",
  position: "absolute",
  flexDirection: "row",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  gap: 2,
};

const Channels = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<PlyrInstance | null>(null);
  const videoObjectUrlRef = useRef("");
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setTitle("");
    setDescription("");
    resetVideoPreview();
    setSeason("");
    setEpisode("");
    setIsEditing(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    resetVideoPreview();
    setSeason("");
    setEpisode("");
    setIsEditing(false);
  };

  const resetVideoPreview = () => {
    if (videoObjectUrlRef.current) {
      URL.revokeObjectURL(videoObjectUrlRef.current);
      videoObjectUrlRef.current = "";
    }

    setVideoUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVideoFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (videoObjectUrlRef.current) {
      URL.revokeObjectURL(videoObjectUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    videoObjectUrlRef.current = nextUrl;
    setVideoUrl(nextUrl);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await fetchProjects({ signal: controller.signal });

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
    return () => {
      if (videoObjectUrlRef.current) {
        URL.revokeObjectURL(videoObjectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open || !videoRef.current) {
      return;
    }

    let isMounted = true;

    async function setupPlayer() {
      const module = (await import("plyr")) as unknown as {
        default?: PlyrConstructor;
      } & PlyrConstructor;
      const PlyrConstructor = module.default ?? module;

      if (!isMounted || !videoRef.current || !PlyrConstructor) {
        return;
      }

      playerRef.current = new PlyrConstructor(videoRef.current, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "settings",
          "fullscreen",
        ],
      });
    }

    setupPlayer();

    return () => {
      isMounted = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [open]);

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
          <Stack
            className="channels-player-frame"
            sx={{
              width: "60%",
              overflow: "hidden",
              gap: 2,
              "& .plyr": {
                width: "100%",
                height: "100%",
              },
              "& .plyr__video-wrapper": {
                height: "100%",
              },
            }}
          >
            <Stack sx={{ height: "calc(100% - 50px)" }}>
              <video
                ref={videoRef}
                controls
                playsInline
                src={videoUrl || undefined}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
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
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => fileInputRef.current?.click()}
              >
                {isEditing ? "Update Video" : "Upload Video"}
              </Button>
              <Button variant="contained" color="primary">
                Cancel
              </Button>
              <Button variant="contained" color="primary">
                {loading ? "Uploading..." : "Submit"}
              </Button>
            </Stack>
          </Stack>
          <Stack sx={{ width: "40%", gap: 2 }}>
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
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
              multiline
              rows={4}
              placeholder="Enter description"
            />
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
        </Stack>
      </Modal>
    </>
  );
};

export default Channels;
