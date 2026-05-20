"use client";

import { useEffect, useState } from "react";
import Catalogue from "../catalogue/Catalogue";
import OnSubscribtion from "../OnSubscribtion/OnSubscribtion";

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
