import type { AdminAboutUsRecord } from "@/types/admin";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAboutUs, updateAboutUs } from "../services/aboutUsApi";
import {
  notifyAdminError,
  notifyAdminSuccess,
} from "../snackbar/notifyAdmin";

type AboutUsFormSnapshot = {
  videoUrl: string;
  title: string;
  message: string;
  isActive: boolean;
};

function toAboutUsFormSnapshot(payload: AdminAboutUsRecord): AboutUsFormSnapshot {
  return {
    videoUrl: typeof payload.videoUrl === "string" ? payload.videoUrl : "",
    title: typeof payload.title === "string" ? payload.title : "",
    message: typeof payload.message === "string" ? payload.message : "",
    isActive: payload.isActive !== false,
  };
}

function applyAboutUsPayload(
  payload: AdminAboutUsRecord,
  setters: {
    setVideoUrl: (value: string) => void;
    setTitle: (value: string) => void;
    setMessage: (value: string) => void;
    setIsActive: (value: boolean) => void;
    setLastUpdatedAt: (value: string | null) => void;
    setSavedSnapshot: (value: AboutUsFormSnapshot) => void;
  }
) {
  const snapshot = toAboutUsFormSnapshot(payload);
  setters.setVideoUrl(snapshot.videoUrl);
  setters.setTitle(snapshot.title);
  setters.setMessage(snapshot.message);
  setters.setIsActive(snapshot.isActive);
  setters.setSavedSnapshot(snapshot);
  setters.setLastUpdatedAt(
    typeof payload.updatedAt === "string" ? payload.updatedAt : null
  );
}

export const useAdminAboutUs = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [savedSnapshot, setSavedSnapshot] = useState<AboutUsFormSnapshot | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAboutUs() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await fetchAboutUs({ signal: controller.signal });

        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        if (!result.ok) {
          setErrorMsg(result.message);
          notifyAdminError(result.message || "Failed to load About Us.");
          return;
        }

        if (!result.aboutUs) {
          return;
        }

        applyAboutUsPayload(result.aboutUs, {
          setVideoUrl,
          setTitle,
          setMessage,
          setIsActive,
          setLastUpdatedAt,
          setSavedSnapshot,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load About Us content.";
        setErrorMsg(message);
        notifyAdminError(message);
      }
    }

    loadAboutUs();

    return () => controller.abort("AboutUs tab unmounted");
  }, []);

  const handleSave = useCallback(async () => {
    const normalizedVideoUrl = videoUrl.trim();
    const normalizedTitle = title.trim();
    const normalizedMessage = message.trim();

    if (!normalizedVideoUrl || !normalizedTitle || !normalizedMessage) {
      const message = "Video URL, title, and message are required.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
      return;
    }

    setSubmitErrorMsg("");
    setIsSubmitting(true);

    try {
      const result = await updateAboutUs({
        videoUrl: normalizedVideoUrl,
        title: normalizedTitle,
        message: normalizedMessage,
        isActive,
      });

      if (!result.ok) {
        const message = result.message || "Failed to save About Us content.";
        setSubmitErrorMsg(message);
        notifyAdminError(message);
        return;
      }

      if (result.aboutUs) {
        applyAboutUsPayload(result.aboutUs, {
          setVideoUrl,
          setTitle,
          setMessage,
          setIsActive,
          setLastUpdatedAt,
          setSavedSnapshot,
        });
      }
      notifyAdminSuccess("About Us saved.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to save About Us content.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [isActive, message, title, videoUrl]);

  const hasChanges = useMemo(() => {
    if (!savedSnapshot) {
      return true;
    }

    return (
      videoUrl.trim() !== savedSnapshot.videoUrl.trim() ||
      title.trim() !== savedSnapshot.title.trim() ||
      message.trim() !== savedSnapshot.message.trim() ||
      isActive !== savedSnapshot.isActive
    );
  }, [isActive, message, savedSnapshot, title, videoUrl]);

  const isSaveDisabled =
    isSubmitting ||
    !hasChanges ||
    !videoUrl.trim() ||
    !title.trim() ||
    !message.trim();

  return {
    errorMsg,
    handleSave,
    isActive,
    isSaveDisabled,
    isSubmitting,
    lastUpdatedAt,
    loading,
    message,
    setIsActive,
    setMessage,
    setTitle,
    setVideoUrl,
    submitErrorMsg,
    title,
    videoUrl,
  };
};
