import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useAdminCatalogue } from "../hooks/useAdminCatalogue";

const Catalogue = () => {
  const {
    content,
    errorMsg,
    fileInputRef,
    handleAddCatalogue,
    handleCancel,
    handleDelete,
    handleEditCatalogue,
    handleProjectMenuClick,
    handleProjectMenuClose,
    handleProjectSelect,
    handleSubmit,
    handleThumbnailChange,
    isEditing,
    isSubmitDisabled,
    isSubmitting,
    loading,
    menuElRef,
    open,
    openProjectMenu,
    projectId,
    projects,
    selectedProject,
    setContent,
    setProjectId,
    setTitle,
    submitErrorMsg,
    thumbnailPreview,
    title,
    visibleCatalogues,
  } = useAdminCatalogue();

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
          direction="row"
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            gap: 2,
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
            onClick={handleAddCatalogue}
          >
            Add Catalogue
          </Button>

          <Button
            variant="outlined"
            onClick={handleProjectMenuClick}
            sx={{
              bgcolor: "white",
              boxShadow: (theme) =>
                `0px 2px 3px 0px ${theme.palette.primary.main}`,
            }}
          >
            <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
              {selectedProject ? selectedProject.name : "All Projects"}
              {selectedProject ? (
                <img
                  src={selectedProject.thumbnail}
                  alt={selectedProject.name}
                  style={{ width: 24, height: 24, objectFit: "contain" }}
                />
              ) : (
                <AddIcon />
              )}
            </Stack>
          </Button>

          <Menu
            anchorEl={menuElRef.current}
            open={openProjectMenu}
            onClose={handleProjectMenuClose}
          >
            {projects.map((project) => (
              <MenuItem
                key={project._id}
                value={project._id}
                selected={selectedProject?._id === project._id}
                onClick={() => handleProjectSelect(project)}
                sx={{
                  mx: 0.5,
                  mb: 0.5,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  },
                  "&.Mui-selected": {
                    border: (theme) =>
                      `1px solid ${theme.palette.primary.main}`,
                  },
                }}
              >
                <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    style={{ width: 20, height: 20, objectFit: "contain" }}
                  />
                  {project.name}
                </Stack>
              </MenuItem>
            ))}
          </Menu>
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
          ) : visibleCatalogues.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No catalogues yet.
            </Typography>
          ) : (
            <Stack
              sx={{
                display: "grid",
                gap: { xs: 2, md: 5 },
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 300px))",
                justifyContent: "center",
                width: "100%",
                px: 2,
                pb: 2,
              }}
            >
              {visibleCatalogues.map((catalogue) => (
                <Stack
                  key={catalogue._id}
                  onClick={() => handleEditCatalogue(catalogue)}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    gap: 0.75,
                    width: 300,
                    boxShadow: 3,
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: 6,
                      cursor: "pointer",
                    },
                  }}
                >
                  {catalogue.thumbnail ? (
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
                        src={catalogue.thumbnail}
                        alt={catalogue.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  ) : null}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      width: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {catalogue.title}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    Project:{" "}
                    {String(
                      projects.find(
                        (project) => project._id === catalogue.projectId
                      )?.name ?? catalogue.projectId
                    )}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      pt: 0.5,
                      pb: 0.5,
                      px: 0.5,
                      height: 110,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 5,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {catalogue.content}
                  </Typography>
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
            width: "min(92vw, 600px)",
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
              {isEditing ? "Edit Catalogue" : "Add Catalogue"}
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
                  aspectRatio: "16 / 6",
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
                    alt="Catalogue thumbnail"
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
                  ? "Edit Catalogue"
                  : "Add Catalogue"}
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

export default Catalogue;
