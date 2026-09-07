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
  fetchAdminAppCatalogueSuggestedVideos,
  updateAdminAppCatalogueHomeVideos,
  updateAdminAppCatalogueNavigationButtons,
  updateAdminAppCatalogueSuggestedVideos,
  updateAdminProjectFeaturedVideos,
} from "../services/appManagementApi";

export const appManagementSections: AppManagementSection[] = [
  { name: "navBtn", title: "Navigation Buttons", url: "" },
  { name: "homeVideo", title: "Home Videos", url: "" },
  { name: "suggestedVideo", title: "Suggested Videos", url: "" },
  { name: "featuredVideo", title: "Featured Videos", url: "" },
];

function existingRecordIds<T extends { _id: string }>(
  selectedIds: string[],
  records: T[]
) {
  const existingIds = new Set(records.map((record) => String(record._id)));
  return selectedIds.filter((id) => existingIds.has(String(id)));
}

function isPublishedVideo(video: { isPublished?: boolean }) {
  return video.isPublished !== false;
}

function publishedRecords<T extends { _id: string; isPublished?: boolean }>(
  records: T[]
) {
  return records.filter(isPublishedVideo);
}

export const useAppManagement = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isRandomVideosSelected, setIsRandomVideosSelected] = useState(true);
  const [homeImage, setHomeImage] = useState("/home.webp");
  const [homeImageRaw, setHomeImageRaw] = useState("/home.webp");
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
  const [suggestedVideoIds, setSuggestedVideoIds] = useState<string[]>([]);
  const [featuredVideoIdsByProject, setFeaturedVideoIdsByProject] = useState<
    Record<string, string[]>
  >({});
  const [draftRailVideoIds, setDraftRailVideoIds] = useState<string[]>([]);

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
        const [navResult, homeVideosResult, suggestedVideosResult] =
          await Promise.all([
            fetchAdminAppCatalogueNavigationButtons({
              signal: controller.signal,
            }),
            fetchAdminAppCatalogueHomeVideos({ signal: controller.signal }),
            fetchAdminAppCatalogueSuggestedVideos({
              signal: controller.signal,
            }),
          ]);

        if (controller.signal.aborted) {
          return;
        }

        if (!navResult.ok) {
          setErrorMsg(
            navResult.message || "Failed to load navigation settings."
          );
        } else {
          setHomeImage(navResult.homeImage || "/home.webp");
          setHomeImageRaw(navResult.homeImageRaw || "/home.webp");
          setSelectedProjectIds(
            existingRecordIds(
              Array.isArray(navResult.selectedProjectIds)
                ? navResult.selectedProjectIds
                : [],
              Array.isArray(navResult.availableProjects)
                ? navResult.availableProjects
                : []
            )
          );
          setAvailableProjects(
            Array.isArray(navResult.availableProjects)
              ? navResult.availableProjects
              : []
          );
        }

        const loadedVideos = homeVideosResult.ok
          ? Array.isArray(homeVideosResult.availableVideos)
            ? homeVideosResult.availableVideos
            : []
          : [];

        if (!homeVideosResult.ok) {
          setErrorMsg(
            homeVideosResult.message || "Failed to load home videos settings."
          );
        } else {
          setIsRandomVideosSelected(homeVideosResult.mode !== "manual");
          setManualVideoIds(
            existingRecordIds(
              Array.isArray(homeVideosResult.manualVideoIds)
                ? homeVideosResult.manualVideoIds
                : [],
              publishedRecords(loadedVideos)
            )
          );
          setAvailableVideos(loadedVideos);
        }

        if (!suggestedVideosResult.ok) {
          setErrorMsg(
            suggestedVideosResult.message || "Failed to load suggested videos."
          );
        } else {
          setSuggestedVideoIds(
            existingRecordIds(
              Array.isArray(suggestedVideosResult.videoIds)
                ? suggestedVideosResult.videoIds
                : [],
              publishedRecords(
                loadedVideos.length > 0
                  ? loadedVideos
                  : Array.isArray(suggestedVideosResult.availableVideos)
                    ? suggestedVideosResult.availableVideos
                    : []
              )
            )
          );
        }

        if (navResult.ok) {
          const nextFeaturedByProject: Record<string, string[]> = {};
          (Array.isArray(navResult.availableProjects)
            ? navResult.availableProjects
            : []
          ).forEach((project) => {
            const storedFeaturedIds = Array.isArray(project.featuredVideoIds)
              ? project.featuredVideoIds
              : [];
            nextFeaturedByProject[project._id] =
              loadedVideos.length > 0
                ? existingRecordIds(
                    storedFeaturedIds,
                    publishedRecords(loadedVideos)
                  )
                : storedFeaturedIds;
          });
          setFeaturedVideoIdsByProject(nextFeaturedByProject);
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
        isPublished: item.isPublished,
      }));
    }

    if (selectedSection?.name === "suggestedVideo") {
      return availableVideos.map((item) => ({
        id: item._id,
        title: item.title,
        image: item.thumbnail,
        projectId: item.projectId,
        isPublished: item.isPublished,
      }));
    }

    if (selectedSection?.name === "featuredVideo") {
      return availableVideos
        .filter((item) => item.projectId === activeNavId)
        .map((item) => ({
          id: item._id,
          title: item.title,
          image: item.thumbnail,
          projectId: item.projectId,
          isPublished: item.isPublished,
        }));
    }

    return [];
  }, [activeNavId, availableProjects, availableVideos, selectedSection?.name]);

  const modalSelectedIds = useMemo(
    () =>
      selectedSection?.name === "navBtn"
        ? draftSelectedProjectIds
        : selectedSection?.name === "homeVideo"
          ? draftManualVideoIds
          : selectedSection?.name === "suggestedVideo" ||
              selectedSection?.name === "featuredVideo"
            ? draftRailVideoIds
            : [],
    [
      draftManualVideoIds,
      draftRailVideoIds,
      draftSelectedProjectIds,
      selectedSection?.name,
    ]
  );

  const publishedAvailableVideos = useMemo(
    () => publishedRecords(availableVideos),
    [availableVideos]
  );

  const previewVideos = useMemo(() => {
    const videosMap = new Map(
      publishedAvailableVideos.map((video) => [video._id, video])
    );
    const previouslySelectedVideos = manualVideoIds
      .map((id) => videosMap.get(id))
      .filter((video): video is AppManagementVideoRecord => Boolean(video));

    if (isRandomVideosSelected) {
      return previouslySelectedVideos.length > 0
        ? previouslySelectedVideos
        : publishedAvailableVideos;
    }

    return previouslySelectedVideos;
  }, [isRandomVideosSelected, manualVideoIds, publishedAvailableVideos]);

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
        : publishedAvailableVideos.filter(
            (video) => video.projectId === activeNavId
          ),
    [activeNavId, publishedAvailableVideos]
  );

  const displayVideos =
    activeNavId === "home" ? previewVideos : activeProjectVideos;

  const railVideos = useMemo(() => {
    const videosMap = new Map(
      publishedAvailableVideos.map((video) => [video._id, video])
    );

    if (activeNavId === "home") {
      return suggestedVideoIds
        .map((id) => videosMap.get(id))
        .filter((video): video is AppManagementVideoRecord => Boolean(video));
    }

    return (featuredVideoIdsByProject[activeNavId] || [])
      .map((id) => videosMap.get(id))
      .filter((video): video is AppManagementVideoRecord => Boolean(video));
  }, [
    activeNavId,
    featuredVideoIdsByProject,
    publishedAvailableVideos,
    suggestedVideoIds,
  ]);

  const openSection = (section: AppManagementSection) => {
    if (section.name === "navBtn") {
      setDraftSelectedProjectIds(
        existingRecordIds(selectedProjectIds, availableProjects)
      );
    }
    if (section.name === "homeVideo") {
      setDraftManualVideoIds(
        existingRecordIds(manualVideoIds, publishedAvailableVideos)
      );
    }
    if (section.name === "suggestedVideo") {
      setDraftRailVideoIds(
        existingRecordIds(suggestedVideoIds, publishedAvailableVideos)
      );
    }
    if (section.name === "featuredVideo") {
      const channelVideos = publishedAvailableVideos.filter(
        (video) => video.projectId === activeNavId
      );
      setDraftRailVideoIds(
        existingRecordIds(
          featuredVideoIdsByProject[activeNavId] || [],
          channelVideos
        )
      );
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

  const openSuggestedVideosModal = () => {
    openSection(appManagementSections[2]);
  };

  const openFeaturedVideosModal = () => {
    openSection(appManagementSections[3]);
  };

  const openRailVideosModal = () => {
    if (activeNavId === "home") {
      openSuggestedVideosModal();
      return;
    }
    openFeaturedVideosModal();
  };

  const handleCloseModal = () => {
    setDraftSelectedProjectIds(
      existingRecordIds(selectedProjectIds, availableProjects)
    );
    setDraftManualVideoIds(
      existingRecordIds(manualVideoIds, publishedAvailableVideos)
    );
    setDraftRailVideoIds(
      activeNavId === "home"
        ? existingRecordIds(suggestedVideoIds, publishedAvailableVideos)
        : existingRecordIds(
            featuredVideoIdsByProject[activeNavId] || [],
            publishedAvailableVideos.filter(
              (video) => video.projectId === activeNavId
            )
          )
    );
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

  const handleRailVideoToggle = (videoId: string, checked: boolean) => {
    if (checked) {
      setDraftRailVideoIds((current) =>
        current.includes(videoId) ? current : [...current, videoId]
      );
      return;
    }
    setDraftRailVideoIds((current) => current.filter((id) => id !== videoId));
  };

  const toggleModalSelection = (id: string) => {
    const isSelected = modalSelectedIds.includes(id);
    if (selectedSection?.name === "navBtn") {
      handleProjectToggle(id, !isSelected);
      return;
    }
    const modalItem = modalItems.find((item) => item.id === id);
    if (modalItem && !isPublishedVideo(modalItem)) {
      return;
    }
    if (selectedSection?.name === "homeVideo") {
      handleManualVideoToggle(id, !isSelected);
      return;
    }
    if (
      selectedSection?.name === "suggestedVideo" ||
      selectedSection?.name === "featuredVideo"
    ) {
      handleRailVideoToggle(id, !isSelected);
    }
  };

  const handleSaveNavigation = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await updateAdminAppCatalogueNavigationButtons({
      projectIds: existingRecordIds(
        draftSelectedProjectIds,
        availableProjects
      ),
      homeImage: homeImageRaw,
      imageFile: homeImageFile,
    });
    setSaving(false);

    if (!result.ok) {
      setErrorMsg(result.message || "Failed to save navigation settings.");
      return;
    }

    setHomeImage(result.homeImage || "/home.webp");
    setHomeImageRaw(result.homeImageRaw || "/home.webp");
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
      manualVideoIds: existingRecordIds(
        draftManualVideoIds,
        publishedAvailableVideos
      ),
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

  const handleSaveSuggestedVideos = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await updateAdminAppCatalogueSuggestedVideos({
      videoIds: existingRecordIds(draftRailVideoIds, publishedAvailableVideos),
    });
    setSaving(false);

    if (!result.ok) {
      setErrorMsg(result.message || "Failed to save suggested videos.");
      return;
    }

    setSuggestedVideoIds(
      existingRecordIds(
        Array.isArray(result.videoIds) ? result.videoIds : [],
        publishedAvailableVideos
      )
    );
    setDraftRailVideoIds(
      existingRecordIds(
        Array.isArray(result.videoIds) ? result.videoIds : [],
        publishedAvailableVideos
      )
    );
    await revalidateAppCataloguePublicData();
    setSuccessMsg("Suggested videos saved.");
    setOpen(false);
    setSelectedSection(null);
  };

  const handleSaveFeaturedVideos = async () => {
    if (activeNavId === "home") {
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const channelVideos = publishedAvailableVideos.filter(
      (video) => video.projectId === activeNavId
    );
    const result = await updateAdminProjectFeaturedVideos(activeNavId, {
      videoIds: existingRecordIds(draftRailVideoIds, channelVideos),
    });
    setSaving(false);

    if (!result.ok) {
      setErrorMsg(result.message || "Failed to save featured videos.");
      return;
    }

    const savedIds = existingRecordIds(
      Array.isArray(result.videoIds) ? result.videoIds : [],
      channelVideos
    );
    setFeaturedVideoIdsByProject((current) => ({
      ...current,
      [activeNavId]: savedIds,
    }));
    setDraftRailVideoIds(savedIds);
    await revalidateAppCataloguePublicData();
    setSuccessMsg("Featured videos saved.");
    setOpen(false);
    setSelectedSection(null);
  };

  const saveModalChanges = () => {
    if (selectedSection?.name === "navBtn") {
      void handleSaveNavigation();
      return;
    }
    if (selectedSection?.name === "homeVideo") {
      void handleSaveHomeVideos();
      return;
    }
    if (selectedSection?.name === "suggestedVideo") {
      void handleSaveSuggestedVideos();
      return;
    }
    if (selectedSection?.name === "featuredVideo") {
      void handleSaveFeaturedVideos();
    }
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
  };
};
