import { Modal, Stack, Typography } from "@mui/material";
import { channelModalStyle } from "./channelModalStyle";

type ChannelThumbnailPreviewModalProps = {
  activeThumbnailPreviewUrl: string;
  open: boolean;
  onClose: () => void;
};

const ChannelThumbnailPreviewModal = ({
  activeThumbnailPreviewUrl,
  open,
  onClose,
}: ChannelThumbnailPreviewModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack
        sx={{
          ...channelModalStyle,
          width: "80%",
          alignItems: "center",
          backgroundColor: "",
          boxShadow: 0,
          p: 0,
        }}
      >
        {activeThumbnailPreviewUrl ? (
          <img
            src={activeThumbnailPreviewUrl}
            alt="Preview Thumbnail"
            style={{
              width: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        ) : (
          <Typography color="text.secondary" variant="body2">
            No thumbnail selected.
          </Typography>
        )}
      </Stack>
    </Modal>
  );
};

export default ChannelThumbnailPreviewModal;
