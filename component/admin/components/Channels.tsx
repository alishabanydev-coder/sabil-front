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
import { useAdminChannels } from "../hooks/useAdminChannels";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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
  const {
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
  } = useAdminChannels();

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
                        handleSelectProject(project._id || project.id || null);
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
              <Stack sx={{ width: "100%", gap: 3, overflow: "auto", pt: 1, pb: 2 }}>
                {seasons.map((seasonNumber) => (
                  <Stack
                    key={seasonNumber}
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
                        onClick={() => handleToggleSeason(seasonNumber)}
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
                            selectedSeason !== seasonNumber
                              ? "common.white"
                              : "error"
                          }
                          variant="body2"
                          sx={{ fontWeight: 700 }}
                        >
                          Season {seasonNumber}
                        </Typography>

                        <IconButton size="small">
                          <motion.span
                            animate={{
                              rotate: selectedSeason === seasonNumber ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            style={{ display: "flex" }}
                          >
                            {selectedSeason === seasonNumber ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </motion.span>
                        </IconButton>
                      </Stack>
                    </Divider>
                    <AnimatePresence initial={false}>
                      {selectedSeason === seasonNumber && (
                        <Stack
                          component={motion.div}
                          key={`season-${seasonNumber}-videos`}
                          direction="row"
                          initial={{ height: 0, opacity: 0, y: -10 }}
                          animate={{ height: "auto", opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -10 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          sx={{
                            gap: 2,
                            flexWrap: "wrap",
                            justifyContent: "center",
                            overflow: "visible",
                            py: 1,
                          }}
                        >
                          {videosBySeason[seasonNumber].map((video, index) => (
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
                disabled={isSubmitDisabled}
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {isSubmitting ? "Uploading..." : "Submit"}
              </Button>

              {isEditingVideo && selectedVideo && !isSubmitting && (
                <Button
                  color="error"
                  variant="outlined"
                  onClick={handleDelete}
                  disabled={!isEditingVideo || !selectedVideo || isSubmitting}
                >
                  Delete
                </Button>
              )}

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
