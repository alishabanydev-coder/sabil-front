"use client";

import SeactionHeader from "@/component/ui/SectionHeader";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";

type ProjectData = {
  _id: string;
  name: string;
  title: string;
  thumbnail: string;
  description: string;
  showInHomepage: boolean;
  homepageOrder: number;
};

const OnSubscribtion = ({
  projects,
  availableProjectIds,
  selectedProject,
  setSelectedProject,
  catalogueSectionId,
}: {
  projects: ProjectData[];
  availableProjectIds: Set<string>;
  selectedProject: string;
  setSelectedProject: (project: string) => void;
  catalogueSectionId?: string;
}) => {
  return (
    <Stack
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        pt: 8,
      }}
    >
      <SeactionHeader text="ON SUBSCRIBTION" />
      <Typography
        sx={{
          color: "secondary.main",
          fontSize: { xs: 9, sm: 14 },
          fontFamily: "Namecat",
          letterSpacing: 1.2,
          textdecoreation: "uppercase",
          width: "80%",
          textAlign: "center",
        }}
      >
        A WHOLE WORLD OF AN AMAZING FEATURE AND BENEFITS FOR YOUR FAMILY
      </Typography>
      <Stack
        direction="row"
        sx={{
          width: { xs: "95%", sm: "80%" },
          gap: { xs: 2, sm: 6 },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {projects.map((item) => {
          const hasCatalogue = availableProjectIds.has(item._id);
          const isSelected = selectedProject === item._id;

          return (
            <Stack
              key={item._id}
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                cursor: hasCatalogue ? "pointer" : "not-allowed",
                opacity: hasCatalogue ? 1 : 0.45,
                filter: isSelected ? "none" : "grayscale(100%)",
                transition: "all 0.3s ease",
              }}
              onClick={() => {
                if (!hasCatalogue) {
                  return;
                }
                setSelectedProject(item._id);
                if (!catalogueSectionId) {
                  return;
                }
                const catalogueSection =
                  document.getElementById(catalogueSectionId);
                catalogueSection?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
            >
              <Image
                src={item.thumbnail}
                alt={item.name}
                fill
                style={{ objectFit: "contain" }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default OnSubscribtion;
