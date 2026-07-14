import {
  alpha,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useAdminBreakdown } from "../hooks/useAdminBreakdown";

const Breakdown = () => {
  const {
    breakdowns,
    content,
    errorMsg,
    fileInputRef,
    handleAddBreakdown,
    handleCancel,
    handleDelete,
    handleEditBreakdown,
    handleSubmit,
    handleThumbnailChange,
    isEditing,
    isSubmitDisabled,
    isSubmitting,
    loading,
    open,
    projectId,
    projects,
    setContent,
    setProjectId,
    setTitle,
    setVideoUrl,
    submitErrorMsg,
    thumbnailPreview,
    title,
    videoUrl,
  } = useAdminBreakdown();

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          height: "calc(100vh - 60px)",
          mt: 3,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
        }}
      >
        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: -20,
            right: 0,
          }}
        >
          <Button
            sx={{
              width: 200,
              boxShadow: (theme) =>
                `0px 2px 12px 1px ${theme.palette.primary.main}`,
            }}
            variant="contained"
            color="primary"
            onClick={handleAddBreakdown}
          >
            Add Breakdown
          </Button>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            height: "100%",
            pt: 6,
            px: 2,
            pb: 2,
            overflow: "auto",
          }}
        >
          {loading ? (
            <Stack sx={{ width: "100%", alignItems: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : errorMsg ? (
            <Typography color="error" variant="body2">
              {errorMsg}
            </Typography>
          ) : breakdowns.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No breakdowns yet.
            </Typography>
          ) : (
            <Stack direction="row" sx={{ gap: 1.5, flexWrap: "wrap" }}>
              {breakdowns.map((breakdown) => (
                <Stack
                  key={breakdown._id}
                  onClick={() => handleEditBreakdown(breakdown)}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    gap: 0.75,
                    width: 300,
                    boxShadow: 3,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  {breakdown.thumbnail ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: 140,
                        borderRadius: 1.5,
                        overflow: "hidden",
                        bgcolor: "grey.200",
                      }}
                    >
                      <img
                        src={breakdown.thumbnail}
                        alt={breakdown.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ) : null}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {breakdown.title}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    Project:{" "}
                    {String(
                      projects.find(
                        (project) => project._id === breakdown.projectId
                      )?.name ?? breakdown.projectId
                    )}
                  </Typography>
                  <Typography variant="body2">{breakdown.content}</Typography>
                  {breakdown.videoUrl ? (
                    <Typography variant="body2" color="primary">
                      {breakdown.videoUrl}
                    </Typography>
                  ) : null}
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>

      <Modal open={open} onClose={handleCancel}>
        <Stack
          sx={{
            direction: "ltr",
            width: 400,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            overflow: "auto",
            maxHeight: "94vh",
            p: 2,
            gap: 2,
          }}
        >
          <Stack sx={{ gap: 2, alignItems: "center", direction: "ltr" }}>
            <Typography variant="h6">
              {isEditing ? "Edit Breakdown" : "Add Breakdown"}
            </Typography>
            <TextField
              label="Project"
              select
              variant="standard"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              fullWidth
              slotProps={{
                select: {
                  renderValue: (selected) =>
                    projects.find((project) => project._id === selected)?.name,
                },
              }}
            >
              {projects.length === 0 ? (
                <MenuItem disabled>No projects uploaded yet</MenuItem>
              ) : (
                projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField
              label="Title"
              variant="standard"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
            />

            <Stack sx={{ width: "100%", gap: 1, alignItems: "center" }}>
              <Box
                sx={{
                  width: "100%",
                  height: 160,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "grey.200",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Breakdown thumbnail"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <ImageOutlinedIcon sx={{ fontSize: 48, color: "grey.600" }} />
                )}
              </Box>
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              <Button
                fullWidth
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
              >
                {thumbnailPreview ? "Change Thumbnail" : "Upload Thumbnail"}
              </Button>
            </Stack>

            <TextField
              label="Breakdwon URL"
              variant="standard"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              fullWidth
            />

            <TextField
              label="Content"
              multiline
              rows={4}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              fullWidth
            />
            <Stack direction="row" sx={{ gap: 2, width: "100%" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "100%" }}
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Edit Breakdown"
                    : "Add Breakdown"}
              </Button>

              {isEditing && (
                <Button
                  onClick={handleDelete}
                  variant="outlined"
                  color="error"
                  disabled={!isEditing || isSubmitting}
                >
                  Delete
                </Button>
              )}

              <Button onClick={handleCancel} variant="outlined" color="primary">
                Cancel
              </Button>
            </Stack>
            {submitErrorMsg ? (
              <Typography color="error" variant="body2">
                {submitErrorMsg}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default Breakdown;
