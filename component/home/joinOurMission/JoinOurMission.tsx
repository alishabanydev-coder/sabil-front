"use client";

import { AppButton } from "@/component/ui/AppButton";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";

const content = [
  {
    title: "inspire",
    description: "young hearts",
    src: "/join-mission-heart.png",
  },
  {
    title: "build ",
    description: "stronger families",
    src: "/family-join-mission.png",
  },
  {
    title: "protect",
    description: "their futures",
    src: "/green-hand.png",
  },
];

// FIXME: add the xs UI and BUttons for the last item and fix the empty Stack

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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: "2%", md: "5%" },
      }}
    >
      <Stack
        sx={{
          width: { xs: "100%", sm: "50%" },
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Stack
          sx={{
            alingItems: "start",
            width: "100%",
            height: { xs: "60%", sm: "65%" },
            justifyContent: "space-between",
          }}
        >
          <Stack
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 24, md: 36, lg: 48, xl: 54 },
                fontFamily: "Arco",
                letterSpacing: 1.2,
                color: "primary.main",
              }}
            >
              Join Our Mission
            </Typography>
          </Stack>
          <Stack
            sx={{
              width: "75%",
              display: { xs: "none", sm: "flex" },
              height: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Namecat",
                fontSize: { xs: 10, sm: 14, md: 16, lg: 22, xl: 24 },
              }}
            >
              Help us create content that inspires, educates and protects
              children around the world.
            </Typography>
          </Stack>
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {content.map((item) => (
              <Stack
                key={item.title}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "start",
                  width: "content-fit",
                  gap: { xs: 1, md: 2 },
                  "& img": {
                    width: { xs: 20, sm: 28, md: 36, lg: 45, xl: 55 },
                    height: { xs: 20, sm: 28, md: 36, lg: 45, xl: 55 },
                    objectFit: "contain",
                  },
                  "& p": {
                    fontFamily: "Namecat",
                    fontSize: { xs: 8, sm: 10, md: 14, lg: 16, xl: 19 },
                  },
                }}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  width={100}
                  height={100}
                />
                <Stack>
                  <Typography>{item.title}</Typography>
                  <Typography>{item.description}</Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
          <Stack sx={{ width: "100%", height: "100%" }}>
            <AppButton>sponsor a project</AppButton>
            <AppButton> become a partner</AppButton>
            <AppButton>support a series</AppButton>
          </Stack>
        </Stack>
      </Stack>
      <Stack sx={{ width: { xs: "0%", sm: "50%" }, height: "100%" }}></Stack>
    </Stack>
  );
};

export default JoinOurMission;
