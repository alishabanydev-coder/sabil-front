import {
  MAIN_PAGE_LAYOUT_SECTIONS,
  type AdminProjectRecord,
  type MainPageLayoutItem,
  type MainPageLayoutSection,
} from "@/types/admin";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchMainPageLayoutItems,
  updateMainPageLayoutItem,
  updateMainPageLayoutSection,
} from "../services/mainPageLayoutApi";
import { fetchProjects } from "../services/projectsApi";

function sortHomepageItems(items: MainPageLayoutItem[]) {
  return items
    .filter((item) => Boolean(item.showInHomepage))
    .sort((firstItem, secondItem) => {
      const firstOrder =
        typeof firstItem.homepageOrder === "number"
          ? firstItem.homepageOrder
          : Number.MAX_SAFE_INTEGER;
      const secondOrder =
        typeof secondItem.homepageOrder === "number"
          ? secondItem.homepageOrder
          : Number.MAX_SAFE_INTEGER;
      return firstOrder - secondOrder;
    });
}

export const useAdminMainPageLayout = () => {
  const menuElRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [openedSection, setOpenedSection] =
    useState<MainPageLayoutSection | null>(null);
  const [sectionItems, setSectionItems] = useState<
    Record<string, MainPageLayoutItem[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMsg, setSaveErrorMsg] = useState("");
  const [projects, setProjects] = useState<AdminProjectRecord[]>([]);
  const [openProjectMenu, setOpenProjectMenu] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<AdminProjectRecord | null>(null);

  const fetchSectionData = useCallback(
    async (sectionName: string, signal?: AbortSignal) => {
      const result = await fetchMainPageLayoutItems(sectionName, { signal });

      if (!result.ok) {
        return {
          ok: false as const,
          message: result.message,
        };
      }

      setSectionItems((current) => ({
        ...current,
        [sectionName]: result.items,
      }));

      return {
        ok: true as const,
        items: result.items,
      };
    },
    []
  );

  const handleProjectMenuClose = useCallback(() => {
    setOpenProjectMenu(false);
  }, []);

  const handleProjectMenuClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenProjectMenu(true);
      menuElRef.current = event.currentTarget;
    },
    []
  );

  const handleProjectSelect = useCallback(
    (project: AdminProjectRecord | null) => {
      setSelectedProject(project);
      if (openedSection?.name === "catalogues") {
        const catalogueItems = sectionItems.catalogues || [];
        const selectedIds = sortHomepageItems(
          catalogueItems.filter((item) => item.projectId === project?._id)
        ).map((item) => item._id);
        setSelectedItemIds(selectedIds);
      }
      handleProjectMenuClose();
    },
    [handleProjectMenuClose, openedSection?.name, sectionItems.catalogues]
  );

  const handleClose = useCallback(() => {
    const activeSection = openedSection;
    setOpen(false);
    setOpenedSection(null);
    setSelectedItemIds([]);
    setSaveErrorMsg("");

    if (activeSection) {
      void fetchSectionData(activeSection.name);
    }
  }, [fetchSectionData, openedSection]);

  const handleOpen = useCallback(
    (section: MainPageLayoutSection) => {
      setOpen(true);
      setOpenedSection(section);
      const sectionData = sectionItems[section.name] || [];
      if (section.name === "catalogues" && selectedProject?._id) {
        setSelectedItemIds(
          sortHomepageItems(
            sectionData.filter((item) => item.projectId === selectedProject._id)
          ).map((item) => item._id)
        );
      } else {
        setSelectedItemIds(
          sortHomepageItems(sectionData).map((item) => item._id)
        );
      }
      setSaveErrorMsg("");
    },
    [sectionItems, selectedProject?._id]
  );

  const handleDelete = useCallback(
    async (sectionName: string, itemId: string) => {
      setSaveErrorMsg("");

      const currentSectionItems = sectionItems[sectionName] || [];
      const deletedItem = currentSectionItems.find((item) => item._id === itemId);
      if (!deletedItem) {
        setSaveErrorMsg("Item not found.");
        return;
      }

      const removeResult = await updateMainPageLayoutItem(sectionName, itemId, {
        showInHomepage: false,
        homepageOrder: null,
      });

      if (!removeResult.ok) {
        setSaveErrorMsg(
          removeResult.message || "Failed to remove item from homepage."
        );
        return;
      }

      if (sectionName === "catalogues") {
        const projectScopedSelectedIds = sortHomepageItems(
          currentSectionItems.filter(
            (item) =>
              item._id !== itemId &&
              item.projectId === deletedItem.projectId &&
              item.showInHomepage
          )
        ).map((item) => item._id);

        const reorderResult = await updateMainPageLayoutSection(
          sectionName,
          projectScopedSelectedIds,
          {
            projectId: deletedItem.projectId,
          }
        );
        if (!reorderResult.ok) {
          setSaveErrorMsg(
            reorderResult.message || "Failed to reorder catalogue items."
          );
          return;
        }

        setSectionItems((current) => ({
          ...current,
          [sectionName]: reorderResult.items,
        }));
        setSelectedItemIds((currentIds) =>
          currentIds.filter((id) => id !== itemId)
        );
        return;
      }

      const sectionAfterRemoval = currentSectionItems.map((item) =>
        item._id === itemId
          ? {
              ...item,
              showInHomepage: false,
              homepageOrder: null,
            }
          : item
      );

      const remainingHomepageItems = sortHomepageItems(sectionAfterRemoval);
      const reorderPayload = remainingHomepageItems
        .map((item, index) => ({
          _id: item._id,
          homepageOrder: index + 1,
          needsUpdate: (item.homepageOrder ?? null) !== index + 1,
        }))
        .filter((item) => item.needsUpdate);

      if (reorderPayload.length > 0) {
        const reorderResults = await Promise.all(
          reorderPayload.map((item) =>
            updateMainPageLayoutItem(sectionName, item._id, {
              homepageOrder: item.homepageOrder,
            })
          )
        );

        const failedReorder = reorderResults.find((result) => !result.ok);
        if (failedReorder) {
          setSaveErrorMsg(
            failedReorder.message || "Failed to reorder homepage items."
          );
          return;
        }
      }

      setSectionItems((currentItems) => ({
        ...currentItems,
        [sectionName]: sectionAfterRemoval.map((item) =>
          item._id === itemId
            ? {
                ...item,
                showInHomepage: false,
                homepageOrder: null,
              }
            : {
                ...item,
                ...(item.showInHomepage
                  ? {
                      homepageOrder:
                        remainingHomepageItems.findIndex(
                          (homepageItem) => homepageItem._id === item._id
                        ) + 1,
                    }
                  : {}),
              }
        ),
      }));

      setSelectedItemIds((currentIds) =>
        currentIds.filter((id) => id !== itemId)
      );
    },
    [sectionItems]
  );

  const toggleItemSelection = useCallback((itemId: string) => {
    setSelectedItemIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((id) => id !== itemId)
        : [...currentIds, itemId]
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!openedSection) {
      return;
    }

    setIsSaving(true);
    setSaveErrorMsg("");

    try {
      const sectionName = openedSection.name;
      if (sectionName === "catalogues" && !selectedProject?._id) {
        setSaveErrorMsg("Select a project to manage catalogue order.");
        return;
      }
      const saveResult = await updateMainPageLayoutSection(
        sectionName,
        selectedItemIds,
        sectionName === "catalogues" ? { projectId: selectedProject?._id } : {}
      );

      if (!saveResult.ok) {
        setSaveErrorMsg(saveResult.message || "Failed to save selection.");
        return;
      }

      setSectionItems((current) => ({
        ...current,
        [sectionName]: saveResult.items,
      }));

      handleClose();
    } catch (error) {
      setSaveErrorMsg(
        error instanceof Error ? error.message : "Failed to save item."
      );
    } finally {
      setIsSaving(false);
    }
  }, [handleClose, openedSection, selectedItemIds, selectedProject?._id]);

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
          error instanceof Error ? error.message : "Failed to load Projects."
        );
      }
    }

    async function fetchAllSections() {
      try {
        setLoading(true);
        setErrorMsg("");

        const results = await Promise.all(
          MAIN_PAGE_LAYOUT_SECTIONS.map((section) =>
            fetchMainPageLayoutItems(section.name, {
              signal: controller.signal,
            })
          )
        );

        if (controller.signal.aborted) {
          return;
        }

        const failedResult = results.find((result) => !result.ok);
        if (failedResult) {
          setErrorMsg(failedResult.message || "Failed to load section data.");
          return;
        }

        const nextItems: Record<string, MainPageLayoutItem[]> = {};
        MAIN_PAGE_LAYOUT_SECTIONS.forEach((section, index) => {
          nextItems[section.name] = results[index].ok
            ? results[index].items
            : [];
        });
        setSectionItems(nextItems);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error
            ? error.message
            : "Failed to load main page layout data."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProjects();
    fetchAllSections();

    return () => controller.abort("Main page layout unmounted");
  }, []);

  const getSectionPreviewItems = useCallback(
    (sectionName: string) => {
      let sectionPreviewData = sortHomepageItems(
        sectionItems[sectionName] || []
      );
      if (sectionName === "catalogues" && selectedProject?._id) {
        sectionPreviewData = sectionPreviewData.filter(
          (item) => item.projectId === selectedProject._id
        );
      }
      return sectionPreviewData;
    },
    [sectionItems, selectedProject?._id]
  );

  const modalItems = useMemo(() => {
    if (!openedSection) {
      return [];
    }

    if (openedSection.name === "catalogues") {
      const catalogueItems = sectionItems[openedSection.name] || [];
      return selectedProject?._id
        ? catalogueItems.filter((item) => item.projectId === selectedProject._id)
        : catalogueItems;
    }

    return sectionItems[openedSection.name] || [];
  }, [openedSection, sectionItems, selectedProject?._id]);

  return {
    errorMsg,
    getSectionPreviewItems,
    handleClose,
    handleDelete,
    handleOpen,
    handleProjectMenuClick,
    handleProjectMenuClose,
    handleProjectSelect,
    handleSave,
    isSaving,
    loading,
    menuElRef,
    modalItems,
    open,
    openedSection,
    openProjectMenu,
    projects,
    saveErrorMsg,
    sections: MAIN_PAGE_LAYOUT_SECTIONS,
    selectedItemIds,
    selectedProject,
    toggleItemSelection,
  };
};
