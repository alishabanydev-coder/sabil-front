import { Stack, Typography } from "@mui/material";

const JoinOurMission = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        aspectRatio: "16/6.73",
        backgroundImage: "url(/background-join-our-mission.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        direction: "ltr",
      }}
    >
      <Stack
        sx={{
          width: "50%",
          height: "100%",
          justifyContent: "space-between",
          alingItems: "start",
        }}
      >
        <Stack sx={{ width: "100%", height: "100%" }}>
          <Typography
            sx={{
              fontSIze: { xs: 14, sm: 16, md: 20, lg: 32, xl: 36 },
              fontWeight: 700,
              fontFamily: "Bhel Puri",
              letterSpacing: 1.2,
              color: "primary.main",
            }}
          >
            {" "}
            Join Our Mission{" "}
          </Typography>
        </Stack>
        <Stack sx={{ width: "100%", height: "100%" }}>
          <Typography>
            Help us create content that ispires, educates and protects childre
          </Typography>
        </Stack>
        <Stack sx={{ width: "100%", height: "100%" }}></Stack>
        <Stack sx={{ width: "100%", height: "100%" }}></Stack>
      </Stack>
      <Stack sx={{ width: "50%", height: "100%" }}></Stack>
    </Stack>
  );
};

export default JoinOurMission;
