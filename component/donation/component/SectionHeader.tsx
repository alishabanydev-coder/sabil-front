import { Button, Stack, Typography } from "@mui/material";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";

const SectionHeader = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        gap: { xs: 1, sm: 2, md: 3 },
        pt: 8,
      }}
    >
      <Stack direction="row" sx={{ gap: 1.2 }}>
        <VideoSettingsIcon
          sx={{
            fontSize: { xs: 16, sm: 22, md: 32, lg: 36 },
            color: "primary.main",
            mb: 0.2,
          }}
        />
        <Typography
          variant="h2"
          component="h2"
          sx={{
            mt: { xs: 0.3, sm: 0.4, md: 0.2, lg: 0.3 },
            fontSize: { xs: 10, sm: 14, md: 24 },
            fontWeight: 700,
            color: "primary.main",
            fontFamily: "Bhel Puri",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            textAlign: "left",
          }}
        >
          our projects
        </Typography>
      </Stack>

      {/* <Button variant="text" sx={{ mt: 0.2, color: "text.primary" }}>
        <Typography
          variant="body2"
          component="p"
          sx={{ fontSize: { xs: 10, sm: 12, md: 14, lg: 16 } }}
        >
          more ...
        </Typography>
      </Button> */}
    </Stack>
  );
};

export default SectionHeader;
