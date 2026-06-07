"use client";

import WatchPlayerPlayIcon from "@/component/appCatalogue/watch/WatchPlayerPlayIcon";
import { Modal, Stack, Typography } from "@mui/material";
import ReactPlayer from "react-player";

const style = {
  direction: "ltr",
  width: "min(92vw, 960px)",
  maxHeight: "90vh",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  px: { xs: 2, md: 3 },
  py: 1,
  gap: 1,
  overflowY: "auto",
};

type VideoData = {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  projectId: string;
};

const WatchUsModal = ({
  open,
  onClose,
  selectedVideo,
}: {
  open: boolean;
  onClose: () => void;
  selectedVideo: VideoData | null;
}) => {
  const hasVideoUrl =
    typeof selectedVideo?.url === "string" &&
    selectedVideo?.url.trim().length > 0;

  return (
    <Modal open={open} onClose={onClose}>
      <Stack sx={style}>
        <Stack>
          <Stack
            sx={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "black",
            }}
          >
            {hasVideoUrl ? (
              <ReactPlayer
                src={selectedVideo?.url}
                light={
                  selectedVideo?.thumbnail ? (
                    <img
                      src={selectedVideo?.thumbnail}
                      alt={selectedVideo?.title || "Video"}
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    true
                  )
                }
                playIcon={<WatchPlayerPlayIcon />}
                previewAriaLabel={`Play ${selectedVideo?.title || "video"}`}
                controls
                width="100%"
                height="100%"
                playing={open}
              />
            ) : (
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  px: 2,
                }}
              >
                <Typography sx={{ color: "white", textAlign: "center" }}>
                  No video URL was provided for this breakdown.
                </Typography>
              </Stack>
            )}
          </Stack>
          <Stack sx={{ mt: 2, gap: 1 }}>
            <Typography
              sx={{ fontSize: 20, fontWeight: 700, color: "primary.main" }}
            >
              {selectedVideo?.title || "Watch Us Title"}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {selectedVideo?.description || "Watch Us description"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default WatchUsModal;
