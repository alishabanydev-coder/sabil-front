"use client";

import { alpha, LinearProgress, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { PrimaryButton } from "@/component/ui/PrimaryButton";

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

export type PublicDonationProjectCard = {
  _id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  poster: string;
  goalAmount?: number;
  raisedAmount?: number;
};

const getProgressValue = (project: PublicDonationProjectCard) => {
  const goal = Number(project.goalAmount ?? 0);
  const raised = Number(project.raisedAmount ?? 0);

  if (!Number.isFinite(goal) || goal <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((raised / goal) * 100));
};

const ProjectCardContent = ({
  project,
  paddingSide,
}: {
  project: PublicDonationProjectCard;
  paddingSide: "pl" | "pr";
}) => (
  <Stack
    sx={{
      width: "45%",
      alignItems: "start",
      justifyContent: "space-evenly",
      ...(paddingSide === "pl" ? { pl: 2 } : { pr: 2 }),
    }}
  >
    <Typography variant="h6" sx={titleSx}>
      {project.title}
    </Typography>
    <Typography variant="body1">
      {project.shortDescription?.trim() || "Support this project."}
    </Typography>
    <LinearProgress
      aria-label="Donation progress"
      value={getProgressValue(project)}
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
  project: PublicDonationProjectCard;
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
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3),
        boxShadow: (theme) =>
          `-50px 13px 50px 20px ${theme.palette.primary.main}`,
      },
    }}
  >
    <Image
      src={project.poster || "/news2.png"}
      alt={project.title}
      fill
      sizes={imageSizes}
      style={{ objectFit: "contain" }}
    />
    <Stack
      sx={{
        position: "absolute",
        bottom: "5%",
        ...(buttonSide === "left" ? { left: "15%" } : { right: "15%" }),
      }}
    >
      <Link
        href={`/donation/${project.slug || project._id}`}
        style={{ textDecoration: "none" }}
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
      </Link>
    </Stack>
  </Stack>
);

const EvenProjectCard = ({
  project,
}: {
  project: PublicDonationProjectCard;
}) => (
  <>
    <ProjectCardImage
      project={project}
      width="55%"
      clipPath="polygon(0 0, 75% 0, 100% 100%, 0 100%)"
      imageSizes="65vw"
      buttonSide="left"
    />
    <ProjectCardContent project={project} paddingSide="pr" />
  </>
);

const OddProjectCard = ({
  project,
}: {
  project: PublicDonationProjectCard;
}) => (
  <>
    <ProjectCardContent project={project} paddingSide="pl" />
    <ProjectCardImage
      project={project}
      width="55%"
      clipPath="polygon(0 0, 100% 0, 100% 100%, 25% 100%)"
      imageSizes="65vw"
      buttonSide="right"
    />
  </>
);

const ProjectCardSection = ({
  projects,
}: {
  projects: PublicDonationProjectCard[];
}) => {
  if (projects.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary", py: 2 }}>
        No donation projects available right now.
      </Typography>
    );
  }

  return (
    <Stack sx={{ width: "100%", gap: 2 }}>
      {projects.map((project, index) => (
        <Stack key={project._id} sx={cardShellSx}>
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
