import {
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { AdminChannelVideoRecord } from "@/types/admin";
import { channelModalStyle } from "./channelModalStyle";

type ChannelVideoModalProps = {
  activeThumbnailPreviewUrl: string;
  commentCount: number;
  description: string;
  episode: string;
  episodeAlreadyExists: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  handleFetchFromYouTube: () => void;
  handleSubmit: () => void;
  isEditing: boolean;
  isEditingVideo: boolean;
  isFetchingYouTube: boolean;
  isPublished: boolean;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  likeCount: number;
  open: boolean;
  parsedEpisode: number;
  parsedSeason: number;
  parsedTags: string[];
  season: string;
  selectedVideo: AdminChannelVideoRecord | null;
  setDescription: (value: string) => void;
  setEpisode: (value: string) => void;
  setIsPublished: (value: boolean) => void;
  setPreviewThumbnail: (value: boolean) => void;
  setSeason: (value: string) => void;
  setTagsInput: (value: string) => void;
  setThumbnail: (file: File | null) => void;
  setTitle: (value: string) => void;
  setVideoUrl: (value: string) => void;
  submitErrorMsg: string;
  tagsInput: string;
  thumbnail: File | null;
  title: string;
  videoUrl: string;
  viewCount: number;
  youTubeFetchErrorMsg: string;
  youTubeFetchStatusMsg: string;
};

const ChannelVideoModal = ({
  activeThumbnailPreviewUrl,
  commentCount,
  description,
  episode,
  episodeAlreadyExists,
  handleClose,
  handleDelete,
  handleFetchFromYouTube,
  handleSubmit,
  isEditing,
  isEditingVideo,
  isFetchingYouTube,
  isPublished,
  isSubmitDisabled,
  isSubmitting,
  likeCount,
  open,
  parsedEpisode,
  parsedSeason,
  parsedTags,
  season,
  selectedVideo,
  setDescription,
  setEpisode,
  setIsPublished,
  setPreviewThumbnail,
  setSeason,
  setTagsInput,
  setThumbnail,
  setTitle,
  setVideoUrl,
  submitErrorMsg,
  tagsInput,
  thumbnail,
  title,
  videoUrl,
  viewCount,
  youTubeFetchErrorMsg,
  youTubeFetchStatusMsg,
}: ChannelVideoModalProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack
        sx={{
          ...channelModalStyle,
          width: 460,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Stack sx={{ width: "100%", gap: 2 }}>
          <Typography
            component="h2"
            sx={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}
          >
            {isEditing ? "Edit Video" : "Add Video"}
          </Typography>

          <Stack direction="row" sx={{ gap: 1, alignItems: "flex-end" }}>
            <TextField
              variant="standard"
              label="Video URL"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              fullWidth
              placeholder="Paste YouTube URL or enter video URL"
            />
            <Button
              variant="outlined"
              color="primary"
              size="small"
              disabled={!videoUrl.trim() || isFetchingYouTube || isSubmitting}
              onClick={handleFetchFromYouTube}
              sx={{ whiteSpace: "nowrap", minWidth: 135, height: 34 }}
            >
              {isFetchingYouTube ? (
                <CircularProgress size={16} sx={{ mr: 1 }} />
              ) : null}
              {isFetchingYouTube ? "Fetching..." : "Fetch YouTube"}
            </Button>
          </Stack>

          {youTubeFetchStatusMsg ? (
            <Typography color="success.main" variant="caption">
              {youTubeFetchStatusMsg}
            </Typography>
          ) : null}
          {youTubeFetchErrorMsg ? (
            <Typography color="error" variant="caption">
              {youTubeFetchErrorMsg}
            </Typography>
          ) : null}

          <TextField
            variant="standard"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            placeholder="Enter title"
          />

          <ButtonGroup size="small" aria-label="Thumbnail actions">
            <Button
              component="label"
              variant={
                thumbnail || selectedVideo?.thumbnail ? "contained" : "outlined"
              }
              color="primary"
            >
              {thumbnail
                ? thumbnail.name
                : isEditingVideo
                ? "Change Thumbnail"
                : "Select Thumbnail"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setThumbnail(event.target.files?.[0] ?? null);
                }}
              />
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!activeThumbnailPreviewUrl}
              onClick={() => {
                setPreviewThumbnail(true);
              }}
            >
              Preview Thumbnail
            </Button>
          </ButtonGroup>

          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder="Enter description"
          />

          <TextField
            label="Tags (comma-separated, auto-filled from YouTube)"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            fullWidth
            size="small"
            placeholder="e.g. kids, stories, cartoons"
          />

          {parsedTags.length > 0 ? (
            <Stack
              direction="row"
              sx={{ gap: 0.75, flexWrap: "wrap", maxHeight: 84, overflowY: "auto" }}
            >
              {parsedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onDelete={() => {
                    const nextTags = parsedTags.filter((item) => item !== tag);
                    setTagsInput(nextTags.join(", "));
                  }}
                />
              ))}
            </Stack>
          ) : null}

          {viewCount > 0 || likeCount > 0 || commentCount > 0 ? (
            <Stack
              direction="row"
              sx={{
                gap: 1.5,
                justifyContent: "space-between",
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Views: <strong>{viewCount.toLocaleString()}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Likes: <strong>{likeCount.toLocaleString()}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Comments: <strong>{commentCount.toLocaleString()}</strong>
              </Typography>
            </Stack>
          ) : null}

          <Stack direction="row" sx={{ gap: 2 }}>
            <TextField
              label="Season"
              type="number"
              value={season}
              onChange={(event) => setSeason(event.target.value)}
              fullWidth
              placeholder="Enter season"
              sx={{ direction: "ltr" }}
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
            />
            <TextField
              label="Episode"
              type="number"
              value={episode}
              onChange={(event) => setEpisode(event.target.value)}
              error={episodeAlreadyExists}
              helperText={
                episodeAlreadyExists
                  ? `Season ${parsedSeason}, episode ${parsedEpisode} already exists.`
                  : ""
              }
              fullWidth
              placeholder="Enter episode"
              sx={{ direction: "ltr" }}
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
            />
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={isPublished}
                onChange={(event) => setIsPublished(event.target.checked)}
              />
            }
            label="Published (visible on the site and app)"
          />

          <Stack
            direction="row"
            sx={{
              gap: 2,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              disabled={isSubmitDisabled}
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {isSubmitting ? "Uploading..." : "Submit"}
            </Button>

            {isEditingVideo && selectedVideo && !isSubmitting && (
              <Button
                color="error"
                variant="outlined"
                onClick={handleDelete}
                disabled={!isEditingVideo || !selectedVideo || isSubmitting}
              >
                Delete
              </Button>
            )}

            <Button onClick={handleClose} variant="outlined" color="primary">
              Cancel
            </Button>
          </Stack>
          <Stack
            sx={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {submitErrorMsg ? (
              <Typography color="error" variant="body2">
                {submitErrorMsg}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ChannelVideoModal;
