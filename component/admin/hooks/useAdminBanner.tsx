import type { AdminBannerRecord } from "@/types/admin";
import { useCallback, useEffect, useState } from "react";
import {
  deleteBannerById,
  fetchBanners,
  uploadBanner,
} from "../services/bannerApi";

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
      setSubmitErrorMsg("Please select a poster image.");
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
        setSubmitErrorMsg(result.message);
        return;
      }

      if (result.banner) {
        setBanners((currentBanners) => [result.banner, ...currentBanners]);
      }
      handleClose();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to upload banner."
      );
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
        setSubmitErrorMsg(result.message);
        return;
      }

      setBanners((currentBanners) =>
        currentBanners.filter((bannerItem) => bannerItem._id !== bannerId)
      );
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to delete banner."
      );
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
          return;
        }

        setBanners(result.banners);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load banner."
        );
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
