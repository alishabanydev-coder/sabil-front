import {
  Button,
  CircularProgress,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createBreakdown, fetchBreakdowns } from "../services/breakdownApi";

const Breakdown = () => {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [breakdowns, setBreakdowns] = useState<
    {
      _id: string;
      projectId: string;
      title: string;
      content: string;
      videoUrl?: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitErrorMsg("");
    setIsSubmitting(true);

    try {
      const result = await createBreakdown({
        projectId: projectId.trim(),
        title: title.trim(),
        content: content.trim(),
        videoUrl: videoUrl.trim(),
      });

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      if (result.breakdown) {
        setBreakdowns((currentBreakdowns) => [
          result.breakdown,
          ...currentBreakdowns,
        ]);
      }

      handleCancel();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to create breakdown."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setProjectId("");
    setTitle("");
    setContent("");
    setVideoUrl("");
    setSubmitErrorMsg("");
  };

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

    loadBreakdowns();

    return () => controller.abort("Breakdowns tab unmounted");
  }, []);

  return (
    <Stack sx={{ width: "100%", height: "100%", position: "relative" }}>
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          mt: 2,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
        }}
      >
        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: -5,
            right: 0,
          }}
        >
          <Button
            sx={{
              width: 200,
              boxShadow: (theme) =>
                `0px 2px 12px 1px ${theme.palette.primary.main}`,
            }}
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add Breakdown
          </Button>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            height: "100%",
            pt: 6,
            px: 2,
            pb: 2,
            overflow: "auto",
          }}
        >
          {loading ? (
            <Stack sx={{ width: "100%", alignItems: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : errorMsg ? (
            <Typography color="error" variant="body2">
              {errorMsg}
            </Typography>
          ) : breakdowns.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No breakdowns yet.
            </Typography>
          ) : (
            <Stack sx={{ gap: 1.5 }}>
              {breakdowns.map((breakdown) => (
                <Stack
                  key={breakdown._id}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    gap: 0.75,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {breakdown.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Project: {String(breakdown.projectId)}
                  </Typography>
                  <Typography variant="body2">{breakdown.content}</Typography>
                  {breakdown.videoUrl ? (
                    <Typography variant="body2" color="primary">
                      {breakdown.videoUrl}
                    </Typography>
                  ) : null}
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>

      <Modal open={open} onClose={handleCancel}>
        <Stack
          sx={{
            width: 400,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            gap: 2,
          }}
        >
          <Stack sx={{ gap: 2, alignItems: "center", direction: "ltr" }}>
            <Typography variant="h6">Add Breakdown</Typography>
            <TextField
              label="Project ID"
              variant="standard"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              fullWidth
            />
            <TextField
              label="Title"
              variant="standard"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
            />

            <TextField
              label="Breakdwon URL"
              variant="standard"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              fullWidth
            />

            <TextField
              label="Content"
              multiline
              rows={4}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              fullWidth
            />
            <Stack direction="row" sx={{ gap: 2, width: "100%" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "100%" }}
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !projectId.trim() ||
                  !title.trim() ||
                  !content.trim()
                }
              >
                {isSubmitting ? "Saving..." : "Add Breakdown"}
              </Button>
              <Button onClick={handleCancel} variant="outlined" color="primary">
                Cancel
              </Button>
            </Stack>
            {submitErrorMsg ? (
              <Typography color="error" variant="body2">
                {submitErrorMsg}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default Breakdown;
