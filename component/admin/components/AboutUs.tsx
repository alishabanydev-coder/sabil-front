import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAboutUs, updateAboutUs } from "../services/aboutUsApi";

const AboutUs = () => {
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

        const payload = result.aboutUs;
        setVideoUrl(typeof payload.videoUrl === "string" ? payload.videoUrl : "");
        setTitle(typeof payload.title === "string" ? payload.title : "");
        setMessage(typeof payload.message === "string" ? payload.message : "");
        setIsActive(payload.isActive !== false);
        setLastUpdatedAt(
          typeof payload.updatedAt === "string" ? payload.updatedAt : null
        );
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

  const handleSave = async () => {
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
        const payload = result.aboutUs;
        setVideoUrl(typeof payload.videoUrl === "string" ? payload.videoUrl : "");
        setTitle(typeof payload.title === "string" ? payload.title : "");
        setMessage(typeof payload.message === "string" ? payload.message : "");
        setIsActive(payload.isActive !== false);
        setLastUpdatedAt(
          typeof payload.updatedAt === "string" ? payload.updatedAt : null
        );
      }
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to save About Us content."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: "calc(100vh - 32px)",
        border: (theme) => `1px solid ${theme.palette.primary.main}`,
        borderRadius: 2,
        overflow: "auto",
        p: 2,
        gap: 2,
      }}
    >
      <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
        About Us
      </Typography>
      <Typography component="p" sx={{ color: "text.secondary" }}>
        Manage the About Us page content shown to visitors.
      </Typography>

      {loading ? (
        <Stack sx={{ width: "100%", alignItems: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Stack>
      ) : errorMsg ? (
        <Typography color="error" variant="body2">
          {errorMsg}
        </Typography>
      ) : (
        <Stack sx={{ gap: 2}}>
          <TextField
            label="YouTube Video URL"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            fullWidth
          />
          <TextField
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
          />
          <TextField
            label="Main Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            multiline
            minRows={6}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
            }
            label="Publish About Us page"
          />
          <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={
                isSubmitting || !videoUrl.trim() || !title.trim() || !message.trim()
              }
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            {lastUpdatedAt ? (
              <Typography variant="body2" color="text.secondary">
                Last updated: {new Date(lastUpdatedAt).toLocaleString()}
              </Typography>
            ) : null}
          </Stack>
          {submitErrorMsg ? (
            <Typography color="error" variant="body2">
              {submitErrorMsg}
            </Typography>
          ) : null}
        </Stack>
      )}
    </Stack>
  );
};

export default AboutUs;
