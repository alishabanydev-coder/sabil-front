import { SxProps, Typography } from "@mui/material";

const SeactionHeader = ({ text, sx }: { text: string, sx?: SxProps }) => (
  <Typography
    sx={{
      fontSize: { xs: 14, sm: 16, md: 24, lg: 32, xl: 36 },
      fontWeight: "bold",
      color: "primary.main",
      fontFamily: "Bhel Puri",
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
