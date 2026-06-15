import { Stack } from "@mui/material";
import ProjectSwiper from "./component/ProjectSwiper";
import SectionHeader from "./component/SectionHeader";

const ProjectSection = () => {
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
      <ProjectSwiper />
    </Stack>
  );
};

export default ProjectSection;
