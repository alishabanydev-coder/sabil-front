"use client";

import { AppButton } from "@/component/ui/AppButton";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";

const content = [
  {
    title: "inspire",
    description: "young hearts",
    src: "/join-mission-heart.webp",
  },
  {
    title: "build ",
    description: "stronger families",
    src: "/family-join-mission.webp",
  },
  {
    title: "protect",
    description: "their futures",
    src: "/green-hand.webp",
  },
];

const JoinOurMission = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        aspectRatio: "16/6.73",
        backgroundImage: "url(/background-join-our-mission.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        direction: "ltr",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: "3%", md: "5%" },
      }}
    >
      <Stack
        sx={{
          width: { xs: "100%", sm: "100%" },
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Stack
          sx={{
            alingItems: "start",
            width: "100%",
            height: { xs: "65%", sm: "60%" },
            justifyContent: "space-between",
          }}
        >
          <Stack
            sx={{
              width: "100%",
              height: "content-fit",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 15, sm: 18, md: 36, lg: 48, xl: 54 },
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
              width: "65%",
              display: "flex",
              height: "content-fit",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Namecat",
                fontSize: { xs: 9, sm: 14, md: 16, lg: 22, xl: 23 },
              }}
            >
              Help us create content that inspires, educates and protects
              children around the world.
            </Typography>
          </Stack>
          <Stack
            sx={{
              width: "100%",
              height: "content-fit",
              flexDirection: "row",
              gap: { xs: 1, md: 3, lg: 5 },
            }}
          >
            {content.map((item) => (
              <Stack
                key={item.title}
                sx={{
                  height: "content-fit",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "start",
                  width: "content-fit",
                  gap: { xs: 1, md: 2 },
                  "& img": {
                    width: { xs: 22, sm: 28, md: 35, lg: 42, xl: 50 },
                    height: { xs: 22, sm: 28, md: 35, lg: 42, xl: 50 },
                    objectFit: "contain",
                  },
                  "& p": {
                    fontFamily: "Namecat",
                    fontSize: { xs: 9, sm: 10, md: 13, lg: 15, xl: 17 },
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
          <Stack
            sx={{
              display: { xs: "none", sm: "flex" },
              width: "100%",
              height: "content-fit",
              flexDirection: "row",
              gap: { xs: 0.8, sm: 2 },
              "& img": {
                width: { xs: 12, sm: 14, md: 20, lg: 22, xl: 26 },
                height: { xs: 5, sm: 6, md: 10, lg: 12, xl: 14 },
              },
              "& .MuiButton-root": {
                display: "flex !important",
                flexDirection: "row",
                gap: { xs: 0.5, sm: 1.2 },
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.6, sm: 1.2 },
                fontFamily: "Namecat",
                fontSize: { xs: 7, sm: 8, md: 12, lg: 14, xl: 16 },
                letterSpacing: 1.5,
                color: "#fff",
              },
            }}
          >
            <AppButton href={"/donation"} tone="primary" borderColor="#9960D2">
              sponsor a project
              <Image
                src={"/white-arrow-right.png"}
                alt={"arrow"}
                width={100}
                height={100}
              />
            </AppButton>
            <AppButton
              href={"/donation"}
              bgColor="#FF4C63"
              borderColor="#F78C9A"
            >
              become a partner
              <Image
                src={"/white-arrow-right.png"}
                alt={"arrow"}
                width={100}
                height={100}
              />
            </AppButton>
            <AppButton
              href={"/donation"}
              bgColor="#67B756"
              borderColor="#BAD465"
            >
              support a series
              <Image
                src={"/white-arrow-right.png"}
                alt={"arrow"}
                width={100}
                height={100}
              />
            </AppButton>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{
          width: { xs: "0%", sm: "50%" },
          height: "80%",
          position: "relative",
        }}
      >
        <Image
          src="/follow-us-image.webp"
          alt="follow us"
          fill
          style={{ objectFit: "contain" }}
        />
      </Stack>
    </Stack>
  );
};

export default JoinOurMission;
