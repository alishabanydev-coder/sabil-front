import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Modal,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  fetchAdminAppCatalogueHomeVideos,
  fetchAdminAppCatalogueNavigationButtons,
  updateAdminAppCatalogueHomeVideos,
  updateAdminAppCatalogueNavigationButtons,
} from "../services/appManagementApi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const sections = [
  { name: "navBtn", title: "Navigation Buttons", url: "" },
  { name: "homeVideo", title: "Home Videos", url: "" },
  // { name: "banner", title: "Banners", url: "" },
];

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

type Section = {
  name: string;
  title: string;
  url: string;
};

type ProjectRecord = {
  _id: string;
  name: string;
  thumbnail: string;
};

type VideoRecord = {
  _id: string;
  title: string;
  thumbnail: string;
  projectId: string;
};

const AppManagement = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isRandomVideosSelected, setIsRandomVideosSelected] = useState(true);
  const [homeImage, setHomeImage] = useState("/home.png");
  const [homeImageRaw, setHomeImageRaw] = useState("/home.png");
  const [homeImageFile, setHomeImageFile] = useState<File | null>(null);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [availableProjects, setAvailableProjects] = useState<ProjectRecord[]>(
    []
  );
  const [availableVideos, setAvailableVideos] = useState<VideoRecord[]>([]);
  const [manualVideoIds, setManualVideoIds] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadData = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const [navResult, homeVideosResult] = await Promise.all([
          fetchAdminAppCatalogueNavigationButtons({
            signal: controller.signal,
          }),
          fetchAdminAppCatalogueHomeVideos({ signal: controller.signal }),
        ]);

        if (controller.signal.aborted) {
          return;
        }

        if (!navResult.ok) {
          setErrorMsg(
            navResult.message || "Failed to load navigation settings."
          );
        } else {
          setHomeImage(navResult.homeImage || "/home.png");
          setHomeImageRaw(navResult.homeImageRaw || "/home.png");
          setSelectedProjectIds(
            Array.isArray(navResult.selectedProjectIds)
              ? navResult.selectedProjectIds
              : []
          );
          setAvailableProjects(
            Array.isArray(navResult.availableProjects)
              ? navResult.availableProjects
              : []
          );
        }

        if (!homeVideosResult.ok) {
          setErrorMsg(
            homeVideosResult.message || "Failed to load home videos settings."
          );
        } else {
          setIsRandomVideosSelected(homeVideosResult.mode !== "manual");
          setManualVideoIds(
            Array.isArray(homeVideosResult.manualVideoIds)
              ? homeVideosResult.manualVideoIds
              : []
          );
          setAvailableVideos(
            Array.isArray(homeVideosResult.availableVideos)
              ? homeVideosResult.availableVideos
              : []
          );
        }
      } catch (error) {
        const isAbortError =
          error instanceof DOMException
            ? error.name === "AbortError"
            : (error as { name?: string })?.name === "AbortError";

        if (!isAbortError && !controller.signal.aborted) {
          setErrorMsg("Failed to load app management settings.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      controller.abort();
    };
  }, []);

  const selectedProjects = useMemo(() => {
    const projectMap = new Map(
      availableProjects.map((project) => [project._id, project])
    );
    return selectedProjectIds
      .map((id) => projectMap.get(id))
      .filter((project): project is ProjectRecord => Boolean(project));
  }, [availableProjects, selectedProjectIds]);

  const modalItems = useMemo(() => {
    if (selectedSection?.name === "navBtn") {
      return availableProjects.map((item) => ({
        id: item._id,
        title: item.name,
        image: item.thumbnail,
      }));
    }

    if (selectedSection?.name === "homeVideo") {
      return availableVideos.map((item) => ({
        id: item._id,
        title: item.title,
        image: item.thumbnail,
      }));
    }

    return [];
  }, [availableProjects, availableVideos, selectedSection?.name]);

  const modalSelectedIds = useMemo(
    () =>
      selectedSection?.name === "navBtn"
        ? selectedProjectIds
        : selectedSection?.name === "homeVideo"
          ? manualVideoIds
          : [],
    [manualVideoIds, selectedProjectIds, selectedSection?.name]
  );

  const previewVideos = useMemo(() => {
    if (isRandomVideosSelected) {
      return availableVideos.slice(0, 8);
    }

    const videosMap = new Map(
      availableVideos.map((video) => [video._id, video])
    );
    return manualVideoIds
      .map((id) => videosMap.get(id))
      .filter((video): video is VideoRecord => Boolean(video));
  }, [availableVideos, isRandomVideosSelected, manualVideoIds]);

  const reset = () => {
    setOpen(false);
    setSuccessMsg("");
  };

  const handleOpen = (section: Section) => {
    setOpen(true);
    setSelectedSection(section);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleProjectToggle = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjectIds((current) =>
        current.includes(projectId) ? current : [...current, projectId]
      );
      return;
    }
    setSelectedProjectIds((current) =>
      current.filter((id) => id !== projectId)
    );
  };

  const handleManualVideoToggle = (videoId: string, checked: boolean) => {
    if (checked) {
      setManualVideoIds((current) =>
        current.includes(videoId) ? current : [...current, videoId]
      );
      return;
    }
    setManualVideoIds((current) => current.filter((id) => id !== videoId));
  };

  const toggleModalSelection = (id: string) => {
    const isSelected = modalSelectedIds.includes(id);
    if (selectedSection?.name === "navBtn") {
      handleProjectToggle(id, !isSelected);
      return;
    }

    if (selectedSection?.name === "homeVideo") {
      handleManualVideoToggle(id, !isSelected);
    }
  };

  const handleSaveNavigation = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    const result = await updateAdminAppCatalogueNavigationButtons({
      projectIds: selectedProjectIds,
      homeImage: homeImageRaw,
      imageFile: homeImageFile,
    });
    setSaving(false);

    if (!result.ok) {
      setErrorMsg(result.message || "Failed to save navigation settings.");
      return;
    }

    setHomeImage(result.homeImage || "/home.png");
    setHomeImageRaw(result.homeImageRaw || "/home.png");
    setHomeImageFile(null);
    setSelectedProjectIds(
      Array.isArray(result.selectedProjectIds) ? result.selectedProjectIds : []
    );
    setSuccessMsg("Navigation settings saved.");
  };

  const handleSaveHomeVideos = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    const result = await updateAdminAppCatalogueHomeVideos({
      mode: isRandomVideosSelected ? "random" : "manual",
      manualVideoIds,
    });
    setSaving(false);

    if (!result.ok) {
      setErrorMsg(result.message || "Failed to save home videos settings.");
      return;
    }

    setIsRandomVideosSelected(result.mode !== "manual");
    setManualVideoIds(
      Array.isArray(result.manualVideoIds) ? result.manualVideoIds : []
    );
    setSuccessMsg("Home videos settings saved.");
  };

  const handleRandomModeChange = async (checked: boolean) => {
    setIsRandomVideosSelected(checked);
    setSaving(true);
    setErrorMsg("");
    const result = await updateAdminAppCatalogueHomeVideos({
      mode: checked ? "random" : "manual",
      manualVideoIds,
    });
    setSaving(false);

    if (!result.ok) {
      setIsRandomVideosSelected(!checked);
      setErrorMsg(result.message || "Failed to update random mode.");
      return;
    }
    setSuccessMsg("Home videos mode updated.");
  };

  return (
    <Stack>
      {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
      {successMsg ? <Alert severity="success">{successMsg}</Alert> : null}
      <Stack
        sx={{
          position: "relative",
          height: "calc(100vh - 60px)",
          width: "100%",
          gap: 1,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
          borderRadius: 2,
          py: 2,
          px: 0,
          mt: 3,
        }}
      >
        {loading ? (
          <Stack sx={{ p: 2, alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={28} />
          </Stack>
        ) : null}

        <Stack sx={{ width: "100%", gap: 2, pt: 2, height: "100%" }}>
          <Stack
            sx={{
              flexDirection: "row",
              gap: 2,
              width: "100%",
              height: 120,
              pb: 2,
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
            <img
              src={homeImage || "/home.png"}
              alt="home"
              style={{ width: 75, height: 75 }}
            />
            {selectedProjects.map((project) => (
              <img
                key={project._id}
                src={project.thumbnail}
                alt={project.name}
                style={{ width: 75, height: 75 }}
              />
            ))}
            <Button
              variant="text"
              color="primary"
              onClick={() => handleOpen(sections[0])}
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
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              gap: 1,
              "& .swiper-pagination-bullet": {
                bgcolor: "grey.800",
                opacity: 1,
              },
              "& .swiper-pagination-bullet-active": {
                bgcolor: "primary.main",
                width: "10px",
                height: "10px",
              },
              "& .swiper-button-prev, & .swiper-button-next": {
                color: "primary.main",
              },
              "& .swiper-button-prev::after, & .swiper-button-next::after": {
                fontSize: "20px",
                fontWeight: 700,
              },
            }}
          >
            <Stack
              direction="row"
              sx={{ gap: 2, justifyContent: "center", alignItems: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen(sections[1])}
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
            <Stack
              direction="row"
              sx={{
                gap: 2,
                width: "100%",
                height: "calc(100% - 143px)",
                flexWrap: "wrap",
                overflow: "hidden",
                overflowY: "auto",
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                px: 1,
                py: 1
              }}
            >
              {previewVideos.length > 0
                ? previewVideos.map((video) => (
                    <Stack
                      key={video._id}
                      sx={{
                        width: 240,
                        aspectRatio: "16 / 9",
                        borderRadius: 1,
                        overflow: "hidden",
                        border: (theme) =>
                          `1px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Stack>
                  ))
                : Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      sx={{ width: "100%", height: "100%" }}
                    />
                  ))}
            </Stack>
          </Stack>
          <Stack></Stack>
        </Stack>
      </Stack>

      <Modal open={open} onClose={reset}>
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
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    setHomeImageFile(file);
                    setHomeImage(URL.createObjectURL(file));
                  }}
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
                      p: 1,
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
                        gap: 1,
                      }}
                    >
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => toggleModalSelection(item.id)}
                        disabled={saving}
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
                onClick={
                  selectedSection?.name === "navBtn"
                    ? handleSaveNavigation
                    : handleSaveHomeVideos
                }
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outlined" color="primary" onClick={reset}>
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
