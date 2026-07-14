import type { AdminBreakdownRecord, AdminProjectRecord } from "@/types/admin";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createBreakdown,
  deleteBreakdown,
  fetchBreakdowns,
  updateBreakdown,
} from "../services/breakdownApi";
import { fetchProjects } from "../services/projectsApi";

export const useAdminBreakdown = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [breakdowns, setBreakdowns] = useState<AdminBreakdownRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<AdminProjectRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBreakdownId, setEditingBreakdownId] = useState<string | null>(
    null
  );

  const handleCancel = useCallback(() => {
    setOpen(false);
    setIsEditing(false);
    setEditingBreakdownId(null);
    setProjectId("");
    setTitle("");
    setContent("");
    setVideoUrl("");
    setThumbnailPreview("");
    setThumbnailFile(null);
    setSubmitErrorMsg("");
  }, []);

  const handleAddBreakdown = useCallback(() => {
    setIsEditing(false);
    setEditingBreakdownId(null);
    setProjectId("");
    setTitle("");
    setContent("");
    setVideoUrl("");
    setThumbnailPreview("");
    setThumbnailFile(null);
    setSubmitErrorMsg("");
    setOpen(true);
  }, []);

  const handleEditBreakdown = useCallback((breakdown: AdminBreakdownRecord) => {
    setIsEditing(true);
    setEditingBreakdownId(breakdown._id);
    setOpen(true);
    setProjectId(breakdown.projectId);
    setTitle(breakdown.title);
    setContent(breakdown.content);
    setVideoUrl(breakdown.videoUrl || "");
    setThumbnailPreview(breakdown.thumbnail || "");
    setThumbnailFile(null);
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

  const handleDelete = useCallback(async () => {
    if (!isEditing || !editingBreakdownId) {
      return;
    }

    setSubmitErrorMsg("");
    setIsSubmitting(true);

    try {
      const result = await deleteBreakdown(editingBreakdownId);

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      setBreakdowns((currentBreakdowns) =>
        currentBreakdowns.filter(
          (breakdown) => breakdown._id !== editingBreakdownId
        )
      );
      handleCancel();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to delete breakdown."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [editingBreakdownId, handleCancel, isEditing]);

  const handleSubmit = useCallback(async () => {
    setSubmitErrorMsg("");
    setIsSubmitting(true);

    try {
      const payload = {
        projectId: projectId.trim(),
        title: title.trim(),
        content: content.trim(),
        videoUrl: videoUrl.trim(),
        ...(thumbnailFile ? { thumbnail: thumbnailFile } : {}),
      };

      if (!isEditing && !thumbnailFile) {
        setSubmitErrorMsg("Breakdown thumbnail is required.");
        return;
      }

      const result =
        isEditing && editingBreakdownId
          ? await updateBreakdown(editingBreakdownId, payload)
          : await createBreakdown(payload);

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      if (result.breakdown) {
        setBreakdowns((currentBreakdowns) =>
          isEditing
            ? currentBreakdowns.map((breakdown) =>
                breakdown._id === result.breakdown._id
                  ? result.breakdown
                  : breakdown
              )
            : [result.breakdown, ...currentBreakdowns]
        );
      }

      handleCancel();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error
          ? error.message
          : isEditing
            ? "Failed to update breakdown."
            : "Failed to create breakdown."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    content,
    editingBreakdownId,
    handleCancel,
    isEditing,
    projectId,
    thumbnailFile,
    title,
    videoUrl,
  ]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBreakdowns() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await fetchBreakdowns({ signal: controller.signal });

        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);

        if (!result.ok) {
          setErrorMsg(result.message);
          return;
        }

        setBreakdowns(result.breakdowns);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load breakdowns."
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

    loadBreakdowns();
    loadProjects();

    return () => controller.abort("Breakdowns tab unmounted");
  }, []);

  const isSubmitDisabled =
    isSubmitting ||
    !projectId ||
    !title.trim() ||
    !content.trim() ||
    (!isEditing && !thumbnailFile);

  return {
    breakdowns,
    content,
    editingBreakdownId,
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
  };
};
