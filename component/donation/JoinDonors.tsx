"use client";

import { Box, Stack, Typography } from "@mui/material";
import { AppButton } from "../ui/AppButton";

const DONATION_PROJECTS_SECTION_ID = "donation-projects";
const NAVBAR_SCROLL_OFFSET = 80;

const scrollToDonationProjects = () => {
  const element = document.getElementById(DONATION_PROJECTS_SECTION_ID);
  if (!element) {
    return;
  }

  const top =
    element.getBoundingClientRect().top + window.scrollY - NAVBAR_SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
};

const JoinDonors = () => {
  return (
    <Stack
      sx={{
        direction: "ltr",
        position: "relative",
        width: "100%",
        aspectRatio: "1529/393",
        backgroundImage: "url(/lets-donate.png)",
        backgroundSize: { xs: "contain", sm: "cover" },
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: { xs: 10, sm: 35, lg: 75 },
          height: "120%",
          aspectRatio: "398/489",
          backgroundImage: "url(/yusof-and-maryam.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <Stack
        sx={{
          position: "absolute",
          top: { xs: "25%", sm: "15%", md: "16%", lg: "20%" },
          left: { xs: "32%", sm: "35%" },
          width: "45%",
          height: "100%",
          gap: { xs: 0.5, sm: 1, md: 1.5, lg: 2, xl: 2.5 },
        }}
      >
        <Typography
          sx={{
            fontFamily: "Bhel Puri",
            fontSize: { xs: 12, sm: 22, md: 24, lg: 32, xl: 36 },
            color: "#fff",
          }}
        >
          be part of this journey
        </Typography>
        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: { xs: 10, sm: 13, md: 15, lg: 20, xl: 22 },
            color: "#fff",
            fontFamily: "Namecat",
            letterSpacing: 1.1,
          }}
        >
          your support today builds a better tomorrow for thousands of children.
        </Typography>
      </Stack>
      <Stack
        sx={{
          position: "absolute",
          bottom: "18%",
          right: { xs: "4%", sm: "5%", md: "6%", lg: "8%" },
        }}
      >
        <AppButton
          tone={"donation"}
          href={`#${DONATION_PROJECTS_SECTION_ID}`}
          onClick={(event) => {
            event.preventDefault();
            scrollToDonationProjects();
          }}
          sx={{
            fontFamily: "Namecat",
            color: "primary.dark",
            lineHeight: 1.4,
            fontSize: { xs: 8, sm: 16, md: 20, lg: 22, xl: 24 },
            py: { xs: 0.2, sm: 0.3, md: 0.4, lg: 0.6, xl: 0.8 },
            px: { xs: 0.8, sm: 1.5, md: 2, lg: 2.5, xl: 3 },
          }}
        >
          Donate Now
        </AppButton>
      </Stack>
    </Stack>
  );
};

export default JoinDonors;
