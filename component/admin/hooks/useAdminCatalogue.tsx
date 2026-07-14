import type { AdminCatalogueRecord, AdminProjectRecord } from "@/types/admin";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createChannelCatalogue,
  deleteChannelCatalogue,
  fetchChannelCatalogues,
  fetchProjects,
  updateChannelCatalogue,
} from "../services/projectsApi";

export const useAdminCatalogue = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuElRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [projects, setProjects] = useState<AdminProjectRecord[]>([]);
  const [catalogues, setCatalogues] = useState<AdminCatalogueRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingCatalogueId, setEditingCatalogueId] = useState<string | null>(
    null
  );
  const [openProjectMenu, setOpenProjectMenu] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<AdminProjectRecord | null>(null);

  const visibleCatalogues = selectedProject?._id
    ? catalogues.filter(
        (catalogue) => catalogue.projectId === selectedProject._id
      )
    : catalogues;

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
    (project: AdminProjectRecord) => {
      setSelectedProject(project);
      setProjectId(project._id ?? "");
      handleProjectMenuClose();
    },
    [handleProjectMenuClose]
  );

  const handleCancel = useCallback(() => {
    setOpen(false);
    setIsEditing(false);
    setEditingCatalogueId(null);
    setProjectId("");
    setTitle("");
    setContent("");
    setThumbnailPreview("");
    setThumbnailFile(null);
    setSubmitErrorMsg("");
  }, []);

  const handleAddCatalogue = useCallback(() => {
    setIsEditing(false);
    setEditingCatalogueId(null);
    setTitle("");
    setContent("");
    setThumbnailPreview("");
    setThumbnailFile(null);
    setSubmitErrorMsg("");
    setOpen(true);
  }, []);

  const handleThumbnailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(
          typeof reader.result === "string" ? reader.result : ""
        );
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setSubmitErrorMsg("");
    setIsSubmitting(true);

    try {
      const normalizedImage = thumbnailPreview.trim();
      const payload = {
        header: title.trim(),
        body: content.trim(),
        image: thumbnailFile ?? normalizedImage,
      };

      if (!isEditing && !thumbnailFile) {
        setSubmitErrorMsg("Catalogue image is required.");
        return;
      }
      const result =
        isEditing && editingCatalogueId
          ? await updateChannelCatalogue(
              projectId.trim(),
              editingCatalogueId,
              payload
            )
          : await createChannelCatalogue(projectId.trim(), payload);

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      if (result.catalogue) {
        setCatalogues((currentCatalogues) =>
          isEditing
            ? currentCatalogues.map((catalogue) =>
                catalogue._id === result.catalogue._id
                  ? result.catalogue
                  : catalogue
              )
            : [result.catalogue, ...currentCatalogues]
        );
      }

      handleCancel();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error
          ? error.message
          : isEditing
            ? "Failed to update catalogue."
            : "Failed to create catalogue."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    content,
    editingCatalogueId,
    handleCancel,
    isEditing,
    projectId,
    thumbnailFile,
    thumbnailPreview,
    title,
  ]);

  const handleDelete = useCallback(async () => {
    if (!isEditing || !editingCatalogueId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await deleteChannelCatalogue(
        projectId.trim(),
        editingCatalogueId
      );

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      setCatalogues((currentCatalogues) =>
        currentCatalogues.filter(
          (catalogue) => catalogue._id !== editingCatalogueId
        )
      );
      handleCancel();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to delete catalogue."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [editingCatalogueId, handleCancel, isEditing, projectId]);

  const handleEditCatalogue = useCallback((catalogue: AdminCatalogueRecord) => {
    setIsEditing(true);
    setEditingCatalogueId(catalogue._id);
    setOpen(true);
    setProjectId(catalogue.projectId);
    setTitle(catalogue.title);
    setContent(catalogue.content);
    setThumbnailPreview(catalogue.thumbnail || "");
    setThumbnailFile(null);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalogues() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await fetchChannelCatalogues({
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);

        if (!result.ok) {
          setErrorMsg(result.message);
          return;
        }

        setCatalogues(result.catalogues);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load catalogues."
        );
      }
    }

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

    loadProjects();
    loadCatalogues();

    return () => controller.abort("Catalogues tab unmounted");
  }, []);

  const isSubmitDisabled =
    isSubmitting ||
    !projectId ||
    !title.trim() ||
    !content.trim() ||
    (!isEditing && !thumbnailFile);

  return {
    catalogues,
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
  };
};
