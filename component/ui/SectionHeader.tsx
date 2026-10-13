import { SxProps, Typography } from "@mui/material";

const SeactionHeader = ({ text, sx }: { text: string; sx?: SxProps }) => (
  <Typography
    sx={{
      fontSize: { xs: 20, sm: 25, md: 38, lg: 45, xl: 54 },
      fontWeight: 800,
      color: "primary.main",
      whiteSpace: "pre-line",
      textAlign: "center",
      textTransform: "uppercase",
      ...sx,
    }}
  >
    {text}
  </Typography>
);

export default SeactionHeader;
