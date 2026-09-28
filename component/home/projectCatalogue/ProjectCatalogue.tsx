"use client";

import { useEffect, useState } from "react";
import Catalogue from "../catalogue/Catalogue";
import OnSubscribtion from "../OnSubscribtion/OnSubscribtion";
import { Box, Stack, Typography } from "@mui/material";
import { AppButton } from "@/component/ui/AppButton";

type CatalogueData = {
  _id: string;
  projectId: string;
  header: string;
  body: string;
  image: string;
};

type PublicSectionData = {
  projects: ProjectData[];
  catalogues: CatalogueData[];
};

type ProjectData = {
  _id: string;
  name: string;
  title: string;
  thumbnail: string;
  description: string;
  showInHomepage: boolean;
  homepageOrder: number;
  characters: { name: string; image: string }[];
};

const ProjectCatalogue = ({
  publicSectionData,
}: {
  publicSectionData: PublicSectionData;
}) => {
  const catalogueSectionId = "home-catalogue-section";
  const [selectedProject, setSelectedProject] = useState<string>("");
  const availableProjectIds = new Set(
    publicSectionData.catalogues.map((catalogue) => catalogue.projectId)
  );
  const selectedProjectData = publicSectionData.projects.find(
    (project) => project._id === selectedProject
  );

  useEffect(() => {
    const hasValidSelectedProject = availableProjectIds.has(selectedProject);
    if (hasValidSelectedProject) {
      return;
    }

    const firstAvailableProject = publicSectionData.projects.find((project) =>
      availableProjectIds.has(project._id)
    );
    setSelectedProject(firstAvailableProject?._id ?? "");
  }, [
    selectedProject,
    publicSectionData.projects,
    publicSectionData.catalogues,
  ]);

  return (
    <>
      <Stack
        sx={{
          mt: { xs: 5, sm: 5, md: 5, lg: 8, xl: 10 },
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: { xs: 1, sm: 1, md: 1, lg: 1.2, xl: 1.5 },
        }}
      >
        <Box
          sx={{
            width: { xs: 18, sm: 20, md: 22, lg: 24, xl: 28 },
            aspectRatio: 0.7,
            backgroundImage: `url(/right-splash.png)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "100% 100%",
          }}
        />

        <AppButton
          bgColor="#fd4c68"
          borderColor="#e61818"
          textColor="white"
          shadow="soft"
          sx={{
            px: { xs: 3.5, sm: 4, md: 4, lg: 5, xl: 6 },
            py: { xs: 0.5, sm: 0.5, md: 0.2, lg: 0.3, xl: 0.4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
              letterSpacing: 1.4,
              fontWeight: 100,
              fontFamily: "Namecat",
              textAlign: "center",
            }}
          >
            our creative ecosystem
          </Typography>
        </AppButton>

        <Box
          sx={{
            width: { xs: 18, sm: 20, md: 22, lg: 24, xl: 28 },
            aspectRatio: 0.7,
            backgroundImage: `url(/left-splash.png)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "100% 100%",
          }}
        />
      </Stack>
      
      <OnSubscribtion
        projects={publicSectionData.projects}
        availableProjectIds={availableProjectIds}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        catalogueSectionId={catalogueSectionId}
      />

      <div id={catalogueSectionId}>
        <Catalogue
          catalogues={publicSectionData.catalogues.filter(
            (catalogue) => catalogue.projectId === selectedProject
          )}
          selectedProject={selectedProjectData}
        />
      </div>
    </>
  );
};

export default ProjectCatalogue;
