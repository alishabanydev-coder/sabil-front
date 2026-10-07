import { Stack, Typography } from "@mui/material";
import ProjectCardSection, {
  type PublicDonationProjectCard,
} from "./component/ProjectCardSection";

const ProjectSection = ({
  projects,
}: {
  projects: PublicDonationProjectCard[];
}) => {
  return (
    <Stack
      id="donation-projects"
      sx={{
        direction: "ltr",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        scrollMarginTop: { xs: "72px", md: "88px" },
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
            fontSize: { xs: 11, sm: 14, md: 16, lg: 18, xl: 20 },
            letterSpacing: 1.2,
            textAlign: 'center',
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
