import { alpha, Stack, Typography } from "@mui/material";

const DonorOpinion = () => {
  return (
    <Stack
      sx={{
        borderColor: "#A0CB45",
        borderWidth: 2,
        borderStyle: "solid",
        borderRadius: 5,
        backgroundColor: alpha("#A0CB45", 0.1),
        px: { xs: 1.5, sm: 2 },
        py: { xs: 3, sm: 6 },
        gap: 2,
        direction: "ltr",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Arco",
            fontSize: { xs: 20, sm: 24, md: 32, lg: 36, xl: 42 },
            color: "primary.main",
          }}
        >
          Our Projects
        </Typography>
      </Stack>
    </Stack>
  );
};

export default DonorOpinion;
