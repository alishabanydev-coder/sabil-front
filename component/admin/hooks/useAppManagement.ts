import type {
  AppManagementModalItem,
  AppManagementProjectPreviewData,
  AppManagementProjectRecord,
  AppManagementSection,
  AppManagementVideoRecord,
} from "@/types/admin";
import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import {
  fetchAdminAppCatalogueHomeVideos,
  fetchAdminAppCatalogueNavigationButtons,
  updateAdminAppCatalogueHomeVideos,
  updateAdminAppCatalogueNavigationButtons,
} from "../services/appManagementApi";

export const appManagementSections: AppManagementSection[] = [
  { name: "navBtn", title: "Navigation Buttons", url: "" },
  { name: "homeVideo", title: "Home Videos", url: "" },
];

export const useAppManagement = () => {
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
  const [availableProjects, setAvailableProjects] = useState<AppManagementProjectRecord[]>(
    []
  );
  const [availableVideos, setAvailableVideos] = useState<AppManagementVideoRecord[]>([]);
  const [manualVideoIds, setManualVideoIds] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<AppManagementSection | null>(null);
  const [activeNavId, setActiveNavId] = useState<string>("home");
  const [draftSelectedProjectIds, setDraftSelectedProjectIds] = useState<
    string[]
  >([]);
  const [draftManualVideoIds, setDraftManualVideoIds] = useState<string[]>([]);

  const revalidateAppCataloguePublicData = async () => {
    try {
      await fetch("/api/revalidate-app-catalogue", {
        method: "POST",
      });
    } catch {
      // Ignore revalidate errors so admin save flow is not blocked.
    }
  };

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
      .filter((project): project is AppManagementProjectRecord => Boolean(project));
  }, [availableProjects, selectedProjectIds]);

  const modalItems = useMemo<AppManagementModalItem[]>(() => {
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
        projectId: item.projectId,
      }));
    }

    return [];
  }, [availableProjects, availableVideos, selectedSection?.name]);

  const modalSelectedIds = useMemo(
    () =>
      selectedSection?.name === "navBtn"
        ? draftSelectedProjectIds
        : selectedSection?.name === "homeVideo"
          ? draftManualVideoIds
          : [],
    [draftManualVideoIds, draftSelectedProjectIds, selectedSection?.name]
  );

  const previewVideos = useMemo(() => {
    const videosMap = new Map(
      availableVideos.map((video) => [video._id, video])
    );
    const previouslySelectedVideos = manualVideoIds
      .map((id) => videosMap.get(id))
      .filter((video): video is AppManagementVideoRecord => Boolean(video));

    if (isRandomVideosSelected) {
      return previouslySelectedVideos.length > 0
        ? previouslySelectedVideos
        : availableVideos;
    }

    return previouslySelectedVideos;
  }, [availableVideos, isRandomVideosSelected, manualVideoIds]);

  const projectById = useMemo(() => {
    const projectMap = new Map<string, AppManagementProjectPreviewData>();
    availableProjects.forEach((project) => {
      projectMap.set(project._id, {
        _id: project._id,
        title: project.name,
        name: project.name,
        image: project.thumbnail,
      });
    });
    return projectMap;
  }, [availableProjects]);

  useEffect(() => {
    if (
      activeNavId !== "home" &&
      !selectedProjects.some((project) => project._id === activeNavId)
    ) {
      setActiveNavId("home");
    }
  }, [activeNavId, selectedProjects]);

  const activeProject = useMemo(
    () =>
      activeNavId === "home"
        ? null
        : selectedProjects.find((project) => project._id === activeNavId) ||
          null,
    [activeNavId, selectedProjects]
  );

  const activeProjectVideos = useMemo(
    () =>
      activeNavId === "home"
        ? []
        : availableVideos.filter((video) => video.projectId === activeNavId),
    [activeNavId, availableVideos]
  );

  const displayVideos =
    activeNavId === "home" ? previewVideos : activeProjectVideos;

  const openSection = (section: AppManagementSection) => {
    if (section.name === "navBtn") {
      setDraftSelectedProjectIds(selectedProjectIds);
    }
    if (section.name === "homeVideo") {
      setDraftManualVideoIds(manualVideoIds);
    }
    setOpen(true);
    setSelectedSection(section);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const openNavigationModal = () => {
    openSection(appManagementSections[0]);
  };

  const openHomeVideosModal = () => {
    openSection(appManagementSections[1]);
  };

  const handleCloseModal = () => {
    setDraftSelectedProjectIds(selectedProjectIds);
    setDraftManualVideoIds(manualVideoIds);
    setOpen(false);
    setSelectedSection(null);
  };

  const handleProjectToggle = (projectId: string, checked: boolean) => {
    if (checked) {
      setDraftSelectedProjectIds((current) =>
        current.includes(projectId) ? current : [...current, projectId]
      );
      return;
    }
    setDraftSelectedProjectIds((current) =>
      current.filter((id) => id !== projectId)
    );
  };

  const handleManualVideoToggle = (videoId: string, checked: boolean) => {
    if (checked) {
      setDraftManualVideoIds((current) =>
        current.includes(videoId) ? current : [...current, videoId]
      );
      return;
    }
    setDraftManualVideoIds((current) => current.filter((id) => id !== videoId));
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
      projectIds: draftSelectedProjectIds,
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
    setDraftSelectedProjectIds(
      Array.isArray(result.selectedProjectIds) ? result.selectedProjectIds : []
    );
    await revalidateAppCataloguePublicData();
    setSuccessMsg("Navigation settings saved.");
    setOpen(false);
    setSelectedSection(null);
  };

  const handleSaveHomeVideos = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await updateAdminAppCatalogueHomeVideos({
      mode: isRandomVideosSelected ? "random" : "manual",
      manualVideoIds: draftManualVideoIds,
    });
    setSaving(false);

    if (!result.ok) {
      setErrorMsg(result.message || "Failed to save home videos settings.");
      return;
    }

    const freshHomeVideos = await fetchAdminAppCatalogueHomeVideos();
    if (freshHomeVideos.ok) {
      setIsRandomVideosSelected(freshHomeVideos.mode !== "manual");
      setManualVideoIds(
        Array.isArray(freshHomeVideos.manualVideoIds)
          ? freshHomeVideos.manualVideoIds
          : []
      );
      setAvailableVideos(
        Array.isArray(freshHomeVideos.availableVideos)
          ? freshHomeVideos.availableVideos
          : []
      );
      setDraftManualVideoIds(
        Array.isArray(freshHomeVideos.manualVideoIds)
          ? freshHomeVideos.manualVideoIds
          : []
      );
    } else {
      setIsRandomVideosSelected(result.mode !== "manual");
      setManualVideoIds(
        Array.isArray(result.manualVideoIds) ? result.manualVideoIds : []
      );
      setDraftManualVideoIds(
        Array.isArray(result.manualVideoIds) ? result.manualVideoIds : []
      );
    }

    await revalidateAppCataloguePublicData();
    setSuccessMsg("Home videos settings saved.");
    setOpen(false);
    setSelectedSection(null);
  };

  const saveModalChanges = () => {
    if (selectedSection?.name === "navBtn") {
      void handleSaveNavigation();
      return;
    }
    void handleSaveHomeVideos();
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

    await revalidateAppCataloguePublicData();
    setSuccessMsg("Home videos mode updated.");
    setOpen(false);
  };

  const handleHomeImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setHomeImageFile(file);
    setHomeImage(URL.createObjectURL(file));
  };

  const handleErrorSnackbarClose = (
    _: Event | SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMsg("");
  };

  const handleSuccessSnackbarClose = (
    _: Event | SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessMsg("");
  };

  return {
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
  };
};
