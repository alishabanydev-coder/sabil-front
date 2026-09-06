import {
  Button,
  ButtonGroup,
  Checkbox,
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
  description: string;
  episode: string;
  episodeAlreadyExists: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  handleSubmit: () => void;
  isEditing: boolean;
  isEditingVideo: boolean;
  isPublished: boolean;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  open: boolean;
  parsedEpisode: number;
  parsedSeason: number;
  season: string;
  selectedVideo: AdminChannelVideoRecord | null;
  setDescription: (value: string) => void;
  setEpisode: (value: string) => void;
  setIsPublished: (value: boolean) => void;
  setPreviewThumbnail: (value: boolean) => void;
  setSeason: (value: string) => void;
  setThumbnail: (file: File | null) => void;
  setTitle: (value: string) => void;
  setVideoUrl: (value: string) => void;
  submitErrorMsg: string;
  thumbnail: File | null;
  title: string;
  videoUrl: string;
};

const ChannelVideoModal = ({
  activeThumbnailPreviewUrl,
  description,
  episode,
  episodeAlreadyExists,
  handleClose,
  handleDelete,
  handleSubmit,
  isEditing,
  isEditingVideo,
  isPublished,
  isSubmitDisabled,
  isSubmitting,
  open,
  parsedEpisode,
  parsedSeason,
  season,
  selectedVideo,
  setDescription,
  setEpisode,
  setIsPublished,
  setPreviewThumbnail,
  setSeason,
  setThumbnail,
  setTitle,
  setVideoUrl,
  submitErrorMsg,
  thumbnail,
  title,
  videoUrl,
}: ChannelVideoModalProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack sx={channelModalStyle}>
        <Stack sx={{ width: "100%", gap: 2 }}>
          <Typography
            component="h2"
            sx={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}
          >
            {isEditing ? "Edit Video" : "Add Video"}
          </Typography>

          <TextField
            variant="standard"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            placeholder="Enter title"
          />

          <TextField
            variant="standard"
            label="Video URL"
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            fullWidth
            placeholder="Enter video url"
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
