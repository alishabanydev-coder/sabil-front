import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  alpha,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Modal,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useAppManagement } from "../hooks/useAppManagement";

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "85vh",
  width: "80%",
  position: "absolute",
  flexDirection: "column",
  overflow: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  gap: 2,
};

const AppManagement = () => {
  const {
    activeNavId,
    activeProject,
    displayVideos,
    errorMsg,
    handleCloseModal,
    handleErrorSnackbarClose,
    handleHomeImageFileChange,
    handleRandomModeChange,
    handleSuccessSnackbarClose,
    homeImage,
    isRandomVideosSelected,
    loading,
    modalItems,
    modalSelectedIds,
    open,
    openHomeVideosModal,
    openNavigationModal,
    projectById,
    saveModalChanges,
    saving,
    selectedProjects,
    selectedSection,
    setActiveNavId,
    successMsg,
    toggleModalSelection,
  } = useAppManagement();

  return (
    <Stack>
      <Snackbar
        open={Boolean(errorMsg)}
        autoHideDuration={5000}
        onClose={handleErrorSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" onClose={handleErrorSnackbarClose}>
          {errorMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(successMsg)}
        autoHideDuration={3000}
        onClose={handleSuccessSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" onClose={handleSuccessSnackbarClose}>
          {successMsg}
        </Alert>
      </Snackbar>

      <Stack
        sx={{
          position: "relative",
          height: "calc(100vh - 60px)",
          width: "100%",
          gap: 1,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
          borderRadius: 2,
          px: 0,
          mt: 3,
        }}
      >
        {loading ? (
          <Stack sx={{ p: 2, alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={28} />
          </Stack>
        ) : null}

        <Stack sx={{ width: "100%", height: "100%", gap: 2 }}>
          <Stack
            sx={{
              flexDirection: "row",
              gap: 2,
              width: "100%",
              height: 120,
              py: 2,
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              borderBottom: (theme) =>
                `1px solid ${theme.palette.primary.main}`,
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
          >
            <Button
              variant="text"
              color="primary"
              onClick={() => setActiveNavId("home")}
              sx={{
                p: 0.5,
                borderRadius: 1.2,
                minWidth: 0,
                border: (theme) =>
                  `2px solid ${
                    activeNavId === "home"
                      ? theme.palette.primary.main
                      : theme.palette.divider
                  }`,
              }}
            >
              <img
                src={homeImage || "/home.webp"}
                alt="home"
                style={{ width: 75, height: 75 }}
              />
            </Button>
            {selectedProjects.map((project) => (
              <Button
                key={project._id}
                variant="text"
                color="primary"
                onClick={() => setActiveNavId(project._id)}
                sx={{
                  p: 0.5,
                  borderRadius: 1.2,
                  minWidth: 0,
                  border: (theme) =>
                    `2px solid ${
                      activeNavId === project._id
                        ? theme.palette.primary.main
                        : theme.palette.divider
                    }`,
                }}
              >
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  style={{ width: 75, height: 75 }}
                />
              </Button>
            ))}
            <Button
              variant="text"
              color="primary"
              onClick={openNavigationModal}
              sx={{
                position: "relative",
                p: 0,
                borderRadius: "50%",
                minWidth: 0,
              }}
            >
              <Skeleton variant="circular" sx={{ width: 50, height: 50 }} />
              <AddIcon
                sx={{
                  position: "absolute",
                  fontSize: 36,
                  color: "action.disabled",
                }}
              />
            </Button>
          </Stack>

          <Stack sx={{ width: "100%", flex: 1, minHeight: 0 }}>
            {activeNavId === "home" ? (
              <Stack
                direction="row"
                sx={{
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  pb: 1,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openHomeVideosModal}
                  disabled={isRandomVideosSelected}
                >
                  Manage Home Videos
                </Button>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isRandomVideosSelected}
                      disabled={saving}
                      onChange={(event) =>
                        handleRandomModeChange(event.target.checked)
                      }
                    />
                  }
                  label="Random Videos from Database"
                />
              </Stack>
            ) : (
              <Stack
                direction="row"
                sx={{ justifyContent: "center", alignItems: "center", pb: 1 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {activeProject?.name || "Project"} Videos
                </Typography>
              </Stack>
            )}

            <Divider flexItem sx={{ width: "95%", mx: "auto" }} />

            <Stack
              sx={{
                pt: 2,
                width: "100%",
                height: "100%",
                overflow: "auto",
                alignItems: "center",
              }}
            >
              <Stack
                direction="row"
                sx={{
                  display: "grid",
                  gap: { xs: 2, md: 5 },
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(300px, 300px))",
                  justifyContent: "center",
                  width: "100%",
                  px: 2,
                  pb: 2,
                }}
              >
                {displayVideos.length > 0 ? (
                  displayVideos.map((video) => {
                    const project = projectById.get(video.projectId);
                    const projectLogo = project?.image || video.thumbnail;
                    const projectName =
                      project?.title || project?.name || "Project";
                    return (
                      <Stack
                        key={video._id}
                        sx={{
                          opacity:
                            activeNavId === "home" && isRandomVideosSelected
                              ? 0.5
                              : 1,
                          cursor:
                            activeNavId === "home" && isRandomVideosSelected
                              ? "not-allowed"
                              : "pointer",
                          width: 300,
                          borderRadius: 1,
                          overflow: "hidden",
                          border: (theme) =>
                            `1px solid ${theme.palette.primary.main}`,
                          "&:hover": {
                            boxShadow: (theme) =>
                              `0 0 10px 5px ${alpha(
                                theme.palette.primary.main,
                                0.3
                              )}`,
                            cursor: "pointer",
                          },
                        }}
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          style={{
                            width: "100%",
                            aspectRatio: "16 / 9",
                            objectFit: "contain",
                          }}
                        />
                        <Divider flexItem />
                        <Stack
                          direction="row"
                          sx={{
                            pl: 0.8,
                            gap: 1,
                            alignItems: "center",
                            "& img": {
                              objectFit: "contain",
                              border: "1px solid",
                              borderColor: "primary.main",
                              borderRadius: "50%",
                            },
                          }}
                        >
                          <Image
                            src={projectLogo}
                            alt={projectName}
                            width={36}
                            height={36}
                            style={{ objectFit: "contain" }}
                          />
                          <Stack sx={{ width: "100%", overflow: "hidden" }}>
                            <Typography
                              variant="h6"
                              sx={{
                                width: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: "text.primary",
                                fontWeight: 700,
                                fontSize: { xs: 12, sm: 14, md: 16 },
                              }}
                            >
                              {video.title}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                width: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: "text.secondary",
                                fontWeight: 300,
                                fontFamily: "Namecat",
                                letterSpacing: 2,
                                fontSize: { xs: 10, sm: 12 },
                              }}
                            >
                              {projectName}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    );
                  })
                ) : activeNavId === "home" ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      sx={{ width: "100%", height: "100%" }}
                    />
                  ))
                ) : (
                  <Stack
                    sx={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      No videos found for this project.
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Modal open={open} onClose={handleCloseModal}>
        <Stack sx={style}>
          <Stack direction="row" sx={{ alignItems: "baseline", gap: 2 }}>
            <Typography variant="h6">
              Manage {selectedSection?.title || "App Catalogue"}
            </Typography>
            {selectedSection?.name === "navBtn" ? (
              <Button component="label" variant="outlined" disabled={saving}>
                Upload Home Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleHomeImageFileChange}
                />
              </Button>
            ) : null}
          </Stack>

          {selectedSection?.name === "homeVideo" ? (
            <Typography variant="body2" color="text.secondary">
              {isRandomVideosSelected
                ? "Random mode is active. You can still prepare manual order for later."
                : "Manual mode is active. Ordered list below is used on Home."}
            </Typography>
          ) : null}

          <Stack sx={{ width: "100%", gap: 2 }}>
            <Stack
              direction="row"
              sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                justifyContent: "center",
                borderRadius: 1,
                width: "100%",
                minHeight: 320,
                maxHeight: 420,
                overflowY: "auto",
                gap: 1,
                p: 1,
                flexWrap: "wrap",
              }}
            >
              {modalItems.map((item) => {
                const project =
                  selectedSection?.name === "homeVideo" && item.projectId
                    ? projectById.get(item.projectId)
                    : undefined;
                const projectLogo = project?.image || item.image;
                const projectName = project?.name || "Project";
                const isSelected = modalSelectedIds.includes(item.id);
                const selectedOrder = isSelected
                  ? modalSelectedIds.indexOf(item.id) + 1
                  : null;

                return (
                  <Stack
                    key={item.id}
                    onClick={() => toggleModalSelection(item.id)}
                    sx={{
                      width: 250,
                      height: 180,
                      border: (theme) =>
                        `1px solid ${
                          isSelected
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`,
                      borderRadius: 1,
                      cursor: "pointer",
                      bgcolor: isSelected ? "action.selected" : "transparent",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => toggleModalSelection(item.id)}
                        disabled={saving}
                      />
                      <Image
                        src={projectLogo}
                        alt={projectName}
                        width={32}
                        height={32}
                        style={{
                          objectFit: "contain",
                          border: "1px solid #aaa",
                          borderRadius: "50%",
                          marginRight: 3,
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight: 600,
                          width: 120,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.title || item.id}
                      </Typography>
                      {selectedOrder ? (
                        <Typography
                          variant="caption"
                          sx={{ color: "primary.main", fontWeight: 700 }}
                        >
                          #{selectedOrder}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>

            <Stack
              direction="row"
              sx={{ width: "100%", gap: 2, alignItems: "center" }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={saveModalChanges}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default AppManagement;
