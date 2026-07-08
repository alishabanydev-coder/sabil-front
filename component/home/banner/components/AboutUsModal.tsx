import WatchPlayerPlayIcon from "@/component/appCatalogue/watch/WatchPlayerPlayIcon";
import { Modal, Stack, Typography } from "@mui/material";
import ReactPlayer from "react-player";

type AboutUsPage = {
  title: string;
  message: string;
  videoUrl: string;
};

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
  py: 2,
  gap: 1,
  overflowY: "auto",
};

const AboutUsModal = ({
  open,
  onClose,
  aboutUs,
}: {
  open: boolean;
  onClose: () => void;
  aboutUs: AboutUsPage | null;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Stack sx={style}>
        <Stack
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "black",
            flexShrink: 0,
            minHeight: 220,
          }}
        >
          <ReactPlayer
            src={aboutUs?.videoUrl}
            playIcon={<WatchPlayerPlayIcon />}
            previewAriaLabel={`Play ${aboutUs?.title || "about us video"}`}
            light={true}
            controls
            width="100%"
            height="100%"
            playing={open}
          />
        </Stack>
        <Stack sx={{ gap: 2 }}>
          <Typography
            sx={{ fontSize: 24, fontWeight: 700, color: "primary.main" }}
          >
            {aboutUs?.title}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
              color: "text.primary",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {aboutUs?.message}
          </Typography>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default AboutUsModal;
