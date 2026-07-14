import type { AdminAboutUsRecord } from "@/types/admin";
import { useCallback, useEffect, useState } from "react";
import { fetchAboutUs, updateAboutUs } from "../services/aboutUsApi";

function applyAboutUsPayload(
  payload: AdminAboutUsRecord,
  setters: {
    setVideoUrl: (value: string) => void;
    setTitle: (value: string) => void;
    setMessage: (value: string) => void;
    setIsActive: (value: boolean) => void;
    setLastUpdatedAt: (value: string | null) => void;
  }
) {
  setters.setVideoUrl(typeof payload.videoUrl === "string" ? payload.videoUrl : "");
  setters.setTitle(typeof payload.title === "string" ? payload.title : "");
  setters.setMessage(typeof payload.message === "string" ? payload.message : "");
  setters.setIsActive(payload.isActive !== false);
  setters.setLastUpdatedAt(
    typeof payload.updatedAt === "string" ? payload.updatedAt : null
  );
}

export const useAdminAboutUs = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
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
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error
            ? error.message
            : "Failed to load About Us content."
        );
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
      setSubmitErrorMsg("Video URL, title, and message are required.");
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
        setSubmitErrorMsg(result.message);
        return;
      }

      if (result.aboutUs) {
        applyAboutUsPayload(result.aboutUs, {
          setVideoUrl,
          setTitle,
          setMessage,
          setIsActive,
          setLastUpdatedAt,
        });
      }
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to save About Us content."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isActive, message, title, videoUrl]);

  const isSaveDisabled =
    isSubmitting || !videoUrl.trim() || !title.trim() || !message.trim();

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
