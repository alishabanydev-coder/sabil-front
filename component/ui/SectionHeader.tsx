import { SxProps, Typography } from "@mui/material";

const SeactionHeader = ({ text, sx }: { text: string, sx?: SxProps }) => (
  <Typography
    sx={{
      fontSize: { xs: 20, sm: 30, md: 36, lg: 40, xl: 45 },
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
