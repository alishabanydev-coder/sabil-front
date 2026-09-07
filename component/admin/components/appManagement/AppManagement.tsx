import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  alpha,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useAppManagement } from "../../hooks/useAppManagement";
import HomeManageModal from "./component/HomeManageModal";
import SuggestedVideosSwiper from "./component/SuggestedVideosSwiper";

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
    openRailVideosModal,
    projectById,
    railVideos,
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

          <SuggestedVideosSwiper
            addLabel={
              activeNavId === "home"
                ? "Add Suggestion Video"
                : "Add Featured Video"
            }
            loading={loading}
            onAdd={openRailVideosModal}
            videos={railVideos}
          />

          <Stack sx={{ width: "100%", flex: 1, minHeight: 0 }}>
            {activeNavId === "home" ? (
              <Divider flexItem sx={{ width: "95%", mx: "auto" }}>
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
              </Divider>
            ) : (
              <Stack
                direction="row"
                sx={{ justifyContent: "center", alignItems: "center", pb: 1 }}
              >
                <Divider flexItem sx={{ width: "95%", mx: "auto" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "Namecat",
                      letterSpacing: 2,
                      color: "primary.main",
                    }}
                  >
                    {activeProject?.name || "Project"} Videos
                  </Typography>
                </Divider>
              </Stack>
            )}

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

      <HomeManageModal
        handleCloseModal={handleCloseModal}
        handleHomeImageFileChange={handleHomeImageFileChange}
        isRandomVideosSelected={isRandomVideosSelected}
        modalItems={modalItems}
        modalSelectedIds={modalSelectedIds}
        open={open}
        projectById={projectById}
        saveModalChanges={saveModalChanges}
        saving={saving}
        selectedSection={selectedSection}
        toggleModalSelection={toggleModalSelection}
      />
    </Stack>
  );
};

export default AppManagement;
