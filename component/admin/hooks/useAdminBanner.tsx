import type { AdminBannerRecord } from "@/types/admin";
import { useCallback, useEffect, useState } from "react";
import {
  deleteBannerById,
  fetchBanners,
  uploadBanner,
} from "../services/bannerApi";
import {
  notifyAdminError,
  notifyAdminSuccess,
} from "../snackbar/notifyAdmin";

export const useAdminBanner = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState("");
  const [banners, setBanners] = useState<AdminBannerRecord[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<AdminBannerRecord | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePreview = posterPreviewUrl || selectedBanner?.poster || "";

  const handleOpen = useCallback(() => {
    setOpen(true);
    setTitle("");
    setPoster(null);
    setSelectedBanner(null);
    setSubmitErrorMsg("");
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTitle("");
    setPoster(null);
    setSelectedBanner(null);
    setSubmitErrorMsg("");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!poster) {
      const message = "Please select a poster image.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMsg("");

    try {
      const result = await uploadBanner({
        title: title.trim(),
        poster,
      });

      if (!result.ok) {
        const message = result.message || "Failed to upload banner.";
        setSubmitErrorMsg(message);
        notifyAdminError(message);
        return;
      }

      if (result.banner) {
        setBanners((currentBanners) => [result.banner, ...currentBanners]);
      }
      notifyAdminSuccess("Banner uploaded.");
      handleClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload banner.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [handleClose, poster, title]);

  const handleDelete = useCallback(async (bannerId: string) => {
    setIsSubmitting(true);
    setSubmitErrorMsg("");

    try {
      const result = await deleteBannerById(bannerId);

      if (!result.ok) {
        const message = result.message || "Failed to delete banner.";
        setSubmitErrorMsg(message);
        notifyAdminError(message);
        return;
      }

      setBanners((currentBanners) =>
        currentBanners.filter((bannerItem) => bannerItem._id !== bannerId)
      );
      notifyAdminSuccess("Banner deleted.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete banner.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBanners() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await fetchBanners({ signal: controller.signal });

        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);

        if (!result.ok) {
          setErrorMsg(result.message);
          notifyAdminError(result.message || "Failed to load banners.");
          return;
        }

        setBanners(result.banners);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        const message =
          error instanceof Error ? error.message : "Failed to load banner.";
        setErrorMsg(message);
        notifyAdminError(message);
      }
    }

    loadBanners();

    return () => controller.abort("Banner tab unmounted");
  }, []);

  useEffect(() => {
    if (!poster) {
      setPosterPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(poster);
    setPosterPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [poster]);

  const isSubmitDisabled = isSubmitting || !title.trim() || !poster;

  return {
    activePreview,
    banners,
    errorMsg,
    handleClose,
    handleDelete,
    handleOpen,
    handleSubmit,
    isSubmitDisabled,
    isSubmitting,
    loading,
    open,
    poster,
    setPoster,
    setTitle,
    submitErrorMsg,
    title,
  };
};
