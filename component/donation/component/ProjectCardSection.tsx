"use client";

import { LinearProgress, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { PrimaryButton } from "@/component/ui/PrimaryButton";

const projects = [
  {
    id: 1,
    name: "Project 1 - Al-Furqan",
    description:
      "This project is about the story of Al-Furqan, a young boy who is a student of the Quran. He is a good student and he is always willing to help his friends.",
    image: "/news2.png",
  },

  {
    id: 2,
    name: "Project 2 - Al-Furqan",
    description:
      "This project is about the story of Al-Furqan, a young boy who is a student of the Quran. He is a good student and he is always willing to help his friends.",
    image: "/news2.png",
  },

  {
    id: 3,
    name: "Project 3 - Al-Furqan",
    description:
      "This project is about the story of Al-Furqan, a young boy who is a student of the Quran. He is a good student and he is always willing to help his friends.",
    image: "/news2.png",
  },

  {
    id: 4,
    name: "Project 4 - Al-Furqan",
    description:
      "This project is about the story of Al-Furqan, a young boy who is a student of the Quran. He is a good student and he is always willing to help his friends.",
    image: "/news2.png",
  },
];

const cardShellSx = {
  width: "100%",
  flexDirection: "row",
  border: "1px solid #e0e0e0",
  borderRadius: 2,
  borderColor: "primary.main",
  boxShadow: 5,
  overflow: "hidden",
} as const;

const titleSx = {
  fontWeight: 700,
  fontFamily: "Namecat",
  color: "primary.main",
  letterSpacing: 2,
} as const;

type Project = (typeof projects)[number];

const ProjectCardContent = ({
  project,
  paddingSide,
}: {
  project: Project;
  paddingSide: "pl" | "pr";
}) => (
  <Stack
    sx={{
      width: "35%",
      alignItems: "start",
      justifyContent: "space-evenly",
      ...(paddingSide === "pl" ? { pl: 2 } : { pr: 2 }),
    }}
  >
    <Typography variant="h6" sx={titleSx}>
      {project.name}
    </Typography>
    <Typography variant="body1">{project.description}</Typography>
    <LinearProgress
      aria-label="Donation progress"
      value={50}
      variant="determinate"
      sx={{ width: "100%", height: 12, borderRadius: 10 }}
    />
  </Stack>
);

const ProjectCardImage = ({
  project,
  width,
  clipPath,
  imageSizes,
  buttonSide,
}: {
  project: Project;
  width: string;
  clipPath: string;
  imageSizes: string;
  buttonSide: "left" | "right";
}) => (
  <Stack
    sx={{
      position: "relative",
      width,
      aspectRatio: "16/9",
      overflow: "hidden",
      clipPath,
      "& img": {
        boxShadow: (theme) =>
          `-50px 13px 50px 20px ${theme.palette.primary.main}`,
      },
    }}
  >
    <Image
      src={project.image}
      alt={project.name}
      fill
      sizes={imageSizes}
      style={{ objectFit: "cover" }}
    />
    <Stack
      sx={{
        position: "absolute",
        bottom: "8%",
        ...(buttonSide === "left" ? { left: "25%" } : { right: "25%" }),
      }}
    >
      <PrimaryButton sx={{ px: 1, py: 0.8 }}>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
            fontFamily: "Namecat",
            letterSpacing: 2,
          }}
        >
          More Details
        </Typography>
      </PrimaryButton>
    </Stack>
  </Stack>
);

const EvenProjectCard = ({ project }: { project: Project }) => (
  <>
    <ProjectCardImage
      project={project}
      width="65%"
      clipPath="polygon(0 0, 75% 0, 100% 100%, 0 100%)"
      imageSizes="65vw"
      buttonSide="left"
    />
    <ProjectCardContent project={project} paddingSide="pr" />
  </>
);

const OddProjectCard = ({ project }: { project: Project }) => (
  <>
    <ProjectCardContent project={project} paddingSide="pl" />
    <ProjectCardImage
      project={project}
      width="65%"
      clipPath="polygon(0 0, 100% 0, 100% 100%, 25% 100%)"
      imageSizes="65vw"
      buttonSide="right"
    />
  </>
);

const ProjectCardSection = () => {
  return (
    <Stack sx={{ width: "100%", gap: 2 }}>
      {projects.map((project, index) => (
        <Stack key={project.id} sx={cardShellSx}>
          {index % 2 === 0 ? (
            <EvenProjectCard project={project} />
          ) : (
            <OddProjectCard project={project} />
          )}
        </Stack>
      ))}
    </Stack>
  );
};

export default ProjectCardSection;
