import { Stack, Typography } from "@mui/material";
import ProjectCardSection from "./component/ProjectCardSection";
import { fetchPublicDonationProjects } from "./services/donationPublicApi";

const ProjectSection = async () => {
  const result = await fetchPublicDonationProjects();
  const projects = result.ok ? result.donationProjects : [];

  return (
    <Stack
      sx={{
        direction: "ltr",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        // pt: { xs: 2, md: 8 },
      }}
    >
      <Stack
        sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Arco",
            fontSize: { xs: 24, sm: 28, md: 36, lg: 45, xl: 54 },
            color: "primary.main",
          }}
        >
          Our Projects
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Namecat",
            fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
            letterSpacing: 1.2,
          }}

        >
          choose a project to see details, updates and how your donation is
          making impact
        </Typography>
      </Stack>
      <ProjectCardSection projects={projects} />
    </Stack>
  );
};

export default ProjectSection;
