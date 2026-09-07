"use client";

import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useAdminChannels } from "../../hooks/useAdminChannels";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChannelThumbnailPreviewModal from "./component/ChannelThumbnailPreviewModal";
import ChannelVideoModal from "./component/ChannelVideoModal";

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
              <Stack
                sx={{ width: "100%", gap: 3, overflow: "auto", pt: 1, pb: 2 }}
              >
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
                        whileHover={{ scale: 1.01 }}
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
                            position: "relative",
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
                                duration: 0.08,
                              }}
                              whileHover={{ y: -4, scale: 1.01 }}
                              sx={{
                                position: "relative",
                                width: 180,
                                gap: 1,
                                alignItems: "center",
                                textAlign: "center",
                                p: 1,
                                cursor: "pointer",
                                borderRadius: 2,
                                filter:
                                  video.isPublished === false
                                    ? "grayscale(100%)"
                                    : "none",
                                transition: "all 0.3s ease",
                                backgroundColor: "background.paper",
                                boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                                opacity: video.isPublished === false ? 0.55 : 1,
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
                                    filter:
                                      video.isPublished === false
                                        ? "blur(1px)"
                                        : "none",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                  }}
                                />
                              </Stack>
                              <Typography variant="body2">
                                {`${video.episode
                                  .toString()
                                  .padStart(2, "0")} - ${video.title}`}
                              </Typography>
                              {video.isPublished === false ? (
                                <Stack
                                  sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: 700,
                                    }}
                                  >
                                    Hidden from public
                                  </Typography>
                                </Stack>
                              ) : null}
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

      <ChannelVideoModal
        activeThumbnailPreviewUrl={activeThumbnailPreviewUrl}
        description={description}
        episode={episode}
        episodeAlreadyExists={episodeAlreadyExists}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        isEditingVideo={isEditingVideo}
        isPublished={isPublished}
        isSubmitDisabled={isSubmitDisabled}
        isSubmitting={isSubmitting}
        open={open}
        parsedEpisode={parsedEpisode}
        parsedSeason={parsedSeason}
        season={season}
        selectedVideo={selectedVideo}
        setDescription={setDescription}
        setEpisode={setEpisode}
        setIsPublished={setIsPublished}
        setPreviewThumbnail={setPreviewThumbnail}
        setSeason={setSeason}
        setThumbnail={setThumbnail}
        setTitle={setTitle}
        setVideoUrl={setVideoUrl}
        submitErrorMsg={submitErrorMsg}
        thumbnail={thumbnail}
        title={title}
        videoUrl={videoUrl}
      />

      <ChannelThumbnailPreviewModal
        activeThumbnailPreviewUrl={activeThumbnailPreviewUrl}
        open={previewThumbnail}
        onClose={() => setPreviewThumbnail(false)}
      />
    </>
  );
};

export default Channels;
