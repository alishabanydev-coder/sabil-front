import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAdminAboutUs } from "../hooks/useAdminAboutUs";

const AboutUs = () => {
  const {
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
  } = useAdminAboutUs();

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
        <Stack sx={{ gap: 2 }}>
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
              disabled={isSaveDisabled}
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
