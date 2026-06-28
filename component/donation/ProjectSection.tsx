import { Stack } from "@mui/material";
import SectionHeader from "./component/SectionHeader";
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
        pt: { xs: 2, md: 0 },
      }}
    >
      <SectionHeader />
      <ProjectCardSection projects={projects} />
    </Stack>
  );
};

export default ProjectSection;
