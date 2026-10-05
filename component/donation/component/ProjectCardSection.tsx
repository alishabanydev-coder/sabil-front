"use client";

import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import { useState } from "react";

const INITIAL_VISIBLE_CARDS = 6;

const colors = [
  "#02D3FC",
  "#FF495F",
  "#A0CB45",
  "#580B98",
  "#F5A305",
  "#0B0DBE",
];

const cardShellSx = {
  width: "100%",
  maxWidth: 410,
  mx: "auto",
  borderRadius: 2,
  borderColor: "primary.main",
  overflow: "hidden",
  textAlign: "center",
  gap: 1,
  pb: { xs: 1.5, md: 3 },
  transition: "box-shadow 0.3s ease",

  "& .project-card-image": {
    width: "100%",
    height: "auto",
    aspectRatio: "16 / 9",
    objectFit: "contain",
  },
} as const;

const ProjcetCard = ({
  project,
  color,
}: {
  project: PublicDonationProjectCard;
  color: string;
}) => {
  return (
    <Stack
      sx={{
        ...cardShellSx,
        // boxShadow: `0 4px 16px ${alpha(color, 0.3)}`,
        boxShadow: `0 4px 16px #ccc`,
        "&:hover": {
          boxShadow: `0 8px 28px ${alpha(color, 0.55)}`,
        },
      }}
    >
      <Image
        className="project-card-image"
        src={project.poster}
        alt={project.title}
        width={300}
        height={300}
      />

      <Typography
        variant="h6"
        sx={{
          fontFamily: "NameCat",
          fontWeight: 900,
          fontSize: { xs: 12, sm: 14, md: 18, lg: 20, xl: 24 },
          letterSpacing: 1.1,
          color: "primary.main",
          WebkitLineClamp: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {project.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontFamily: "Namecat",
          fontSize: { xs: 10, sm: 11, md: 12, lg: 15, xl: 16 },
          WebkitLineClamp: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {project.slug}
      </Typography>

      <Stack
        sx={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.4,
          px: 1.2,
          pt: 1,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Namecat",
            fontSize: { xs: 10, sm: 11, md: 12, lg: 15, xl: 16 },
            color: "text.primary",
          }}
        >
          {((project.raisedAmount / project.goalAmount) * 100).toFixed(0)}%
        </Typography>
        <LinearProgress
          value={(project.raisedAmount / project.goalAmount) * 100}
          variant="determinate"
          sx={{
            width: "100%",
            height: 12,
            borderRadius: 1.5,
            py: "auto",
            "&.MuiLinearProgress-colorPrimary": {
              bgcolor: "#ccc",
            },
            "& .MuiLinearProgress-bar": {
              borderRadius: 1.5,
              bgcolor: color,
            },
          }}
        />
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Namecat",
            fontSize: { xs: 10, sm: 11, md: 12, lg: 15, xl: 16 },
            color: "text.primary",
          }}
        >
          {(100 - (project.raisedAmount / project.goalAmount) * 100).toFixed(0)}
          %
        </Typography>
      </Stack>

      <Stack>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Namecat",
            fontSize: { xs: 10, sm: 11, md: 12, lg: 15, xl: 16 },
            color: "text.secondary",
          }}
        >
          {project.raisedAmount} / {project.goalAmount}
        </Typography>
      </Stack>
      <Button
        variant="contained"
        sx={{
          width: "fit-content",
          mx: "auto",
          mt: 1,
          fontFamily: "Namecat",
          letterSpacing: 1.1,
          py: 0.5,
          px: 3,
          borderRadius: 3,
          fontSize: { xs: 10, sm: 11, md: 12, lg: 15, xl: 16 },
          bgcolor: color,
          "&:hover": {
            bgcolor: color,
            filter: "brightness(0.9)",
          },
        }}
      >
        view project
      </Button>
    </Stack>
  );
};

export type PublicDonationProjectCard = {
  _id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  poster: string;
  goalAmount?: number;
  raisedAmount?: number;
};

const ProjectCardSection = ({
  projects,
}: {
  projects: PublicDonationProjectCard[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const allProjects = [...projects, ...projects, ...projects];
  const visibleProjects = showAll
    ? allProjects
    : allProjects.slice(0, INITIAL_VISIBLE_CARDS);
  const hasMore = allProjects.length > INITIAL_VISIBLE_CARDS;

  if (projects.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary", py: 2 }}>
        No donation projects available right now.
      </Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: { xs: "85%", sm: "100%" },
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
          direction: "ltr",
        }}
      >
        {visibleProjects.map((project, index) => (
          <ProjcetCard
            key={`${project._id}-${index}`}
            project={project}
            color={colors[index % colors.length]}
          />
        ))}
      </Box>
      {hasMore && !showAll ? (
        <Stack>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowAll(true)}
          sx={{
            width: "fit-content",
            mx: "auto",
            fontFamily: "Namecat",
            letterSpacing: 1.2,
            lineHeight: 1.6,
            py: { xs: 0.8, sm: 1, md: 1, lg: 1.4, xl: 1.8 },
            px: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
            fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
            borderRadius: { xs: 5, md: 8 },
            mt: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3.5 },
            gap: { xs: 1, sm: 1.5 },
            "& img": {
              width: { xs: 16, sm: 18, md: 20, lg: 28, xl: 32 },
              height: { xs: 8, sm: 10, md: 12, lg: 15, xl: 18 },
            },
          }}
        >
          view all projects
          <Image
            src="/arrow-right.png"
            alt="arrow right"
            width={20}
            height={20}
          />
        </Button>
        </Stack>
      ) : null}
    </>
  );
};

export default ProjectCardSection;
