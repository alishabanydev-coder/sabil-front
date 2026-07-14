import type { SocialMediaRecord } from "@/types/admin";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createSocialMediaLink,
  deleteSocialMediaLink,
  fetchSocialMediaLinks,
  updateSocialMediaLink,
} from "../services/socialMediaApi";

export const useAdminSocialMedia = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [socialMedias, setSocialMedias] = useState<SocialMediaRecord[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSocialMedia, setEditingSocialMedia] =
    useState<SocialMediaRecord | null>(null);

  const resetForm = useCallback(() => {
    setOpen(false);
    setEditingSocialMedia(null);
    setName("");
    setUrl("");
    setLogo(null);
    setSubmitErrorMsg("");
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSelectForEdit = useCallback((socialMedia: SocialMediaRecord) => {
    setOpen(true);
    setEditingSocialMedia(socialMedia);
    setName(socialMedia.name);
    setUrl(socialMedia.url);
    setLogo(null);
    setSubmitErrorMsg("");
  }, []);

  const handleCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const handleSubmit = useCallback(async () => {
    const normalizedName = name.trim();
    const normalizedUrl = url.trim();

    if (!normalizedName || !normalizedUrl) {
      setSubmitErrorMsg("Name and URL are required.");
      return;
    }

    if (!editingSocialMedia && !logo) {
      setSubmitErrorMsg("Logo is required.");
      return;
    }

    setSubmitErrorMsg("");
    setIsSubmitting(true);
    setOpen(false);

    try {
      const result = editingSocialMedia
        ? await updateSocialMediaLink(editingSocialMedia._id, {
            name: normalizedName,
            url: normalizedUrl,
            ...(logo ? { icon: logo } : {}),
          })
        : await createSocialMediaLink({
            name: normalizedName,
            url: normalizedUrl,
            icon: logo,
          });

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      if (result.socialMediaLink) {
        if (editingSocialMedia) {
          setSocialMedias((currentItems) =>
            currentItems.map((item) =>
              item._id === editingSocialMedia._id
                ? result.socialMediaLink
                : item
            )
          );
        } else {
          setSocialMedias((currentItems) => [
            result.socialMediaLink,
            ...currentItems,
          ]);
        }
      }

      resetForm();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error
          ? error.message
          : editingSocialMedia
            ? "Failed to update social media link."
            : "Failed to create social media link."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [editingSocialMedia, logo, name, resetForm, url]);

  const handleDeleteSocialMedia = useCallback(async () => {
    if (!editingSocialMedia || isSubmitting) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete social media "${editingSocialMedia.name}"?`
    );
    if (!shouldDelete) {
      return;
    }

    setSubmitErrorMsg("");
    setIsSubmitting(true);

    try {
      const result = await deleteSocialMediaLink(editingSocialMedia._id);
      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      setSocialMedias((currentItems) =>
        currentItems.filter((item) => item._id !== editingSocialMedia._id)
      );
      resetForm();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error
          ? error.message
          : "Failed to delete social media link."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [editingSocialMedia, isSubmitting, resetForm]);

  const loadSocialMedia = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await fetchSocialMediaLinks({ signal });

      if (signal?.aborted) {
        return;
      }

      setLoading(false);

      if (!result.ok) {
        setErrorMsg(result.message);
        return;
      }

      setSocialMedias(result.socialMediaLinks);
    } catch (error) {
      if (signal?.aborted) {
        return;
      }

      setLoading(false);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Failed to load social media links."
      );
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadSocialMedia(controller.signal);

    return () => controller.abort("SocialMedia tab unmounted");
  }, [loadSocialMedia]);

  useEffect(() => {
    if (!logo) {
      setLogoPreviewUrl("");
      return;
    }

    const nextPreview = URL.createObjectURL(logo);
    setLogoPreviewUrl(nextPreview);

    return () => {
      URL.revokeObjectURL(nextPreview);
    };
  }, [logo]);

  const displayedLogoUrl = useMemo(
    () => logoPreviewUrl || (editingSocialMedia ? editingSocialMedia.icon : ""),
    [editingSocialMedia, logoPreviewUrl]
  );

  const isSubmitDisabled = useMemo(
    () => isSubmitting || !name.trim() || !url.trim(),
    [isSubmitting, name, url]
  );

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return "Saving...";
    }

    return editingSocialMedia ? "Save Changes" : "Add";
  }, [editingSocialMedia, isSubmitting]);

  return {
    displayedLogoUrl,
    editingSocialMedia,
    errorMsg,
    handleCancel,
    handleClose,
    handleDeleteSocialMedia,
    handleOpen,
    handleSelectForEdit,
    handleSubmit,
    isSubmitDisabled,
    isSubmitting,
    loading,
    logo,
    name,
    open,
    setLogo,
    setName,
    setUrl,
    socialMedias,
    submitErrorMsg,
    submitLabel,
    url,
  };
};
