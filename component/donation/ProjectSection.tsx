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
        sx={{ width: "100%", justifyContent: "center", alignItems: "center", mb: 1.5 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: 20, sm: 25, md: 38, lg: 45, xl: 54 },
            fontWeight: 800,
            color: "primary.main",
            whiteSpace: "pre-line",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Our Projects
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: 11, sm: 14, md: 16, lg: 18, xl: 20 },
            fontWeight: 600,
            textAlign: "center",
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
