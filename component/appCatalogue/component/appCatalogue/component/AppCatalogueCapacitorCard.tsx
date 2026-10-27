"use client";

import {
  alpha,
  Box,
  Button,
  keyframes,
  Stack,
  Typography,
  type SvgIconProps,
} from "@mui/material";
import { type ElementType } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import type { VideoData } from "../../navbarTypes";

type GradientStat = {
  number: number;
  icon: ElementType<SvgIconProps>;
  color: [string, string];
  label: string;
};

const gradientColor = (video: VideoData): GradientStat[] => [
  {
    number: 0,
    icon: BookmarkBorderOutlinedIcon,
    color: ["#0F70E3", "#044CD4"],
    label: "save",
  },
  {
    number: video.likeCount,
    icon: FavoriteBorderRoundedIcon,
    color: ["#FB5C73", "#FB2C5C"],
    label: "likes",
  },
  {
    number: video.viewCount,
    icon: VisibilityRoundedIcon,
    color: ["#7E4DDE", "#6C32C9"],
    label: "views",
  },
];

const stackIcon = {
  flexDirection: "row",
  my: 0.5,
  gap: 0.5,
  alignItems: "center",
  px: 1.4,
  pl: 0.5,
  borderRadius: 6,
  height: 40,

  "& svg": {
    fontSize: 20,
  },
  "& p": {
    color: "text.primary",
    fontWeight: 800,
    fontSize: 12,
    lineHeight: 1,
  },
  "& span": {
    color: "text.secondary",
    fontWeight: 800,
    fontSize: 10,
    lineHeight: 1,
  },
};

const playButtonWave = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.85);
    opacity: 0;
  }
`;

function StatGradientDefs({ videoId, video }: { videoId: string; video: VideoData }) {
  const stats = gradientColor(video);
  return (
    <svg
      aria-hidden
      focusable={false}
      width={0}
      height={0}
      style={{ position: "absolute" }}
    >
      <defs>
        {stats.map((stat, index) => (
          <linearGradient
            key={stat.label}
            id={`capacitor-stat-gradient-${videoId}-${index}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={stat.color[0]} />
            <stop offset="100%" stopColor={stat.color[1]} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

function GradientIcon({
  icon: Icon,
  id,
}: {
  icon: ElementType<SvgIconProps>;
  id: string;
}) {
  return <Icon style={{ fill: `url(#${id})` }} />;
}

//FiXME: fix the on click Card and not White Space

export default function AppCatalogueCapacitorCard({
  video,
}: {
  video: VideoData;
}) {
  const router = useRouter();

  const watchVideo = () => {
    router.push(`/app/watch/${video._id}`);
  };

  return (
    <Stack
      tabIndex={0}
      role="button"
      aria-label={`Watch ${video.title}`}
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: 6,
        boxShadow: 3,
        overflow: "hidden",
        bgcolor: "white",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
        WebkitUserSelect: "none",
        transition: "all 0.35s ease",

        "&:hover, &:focus-visible": {
          boxShadow: (theme) =>
            `0px 2px 10px 1px ${theme.palette.primary.main}`,
        },

        "&:hover .app-catalogue-page-image, &:focus-visible .app-catalogue-page-image":
          {
            transform: "scale(1.1) rotate(3deg)",
          },

        "&:hover .app-catalogue-page-play-button, &:focus-visible .app-catalogue-page-play-button":
          {
            bgcolor: alpha("#fff", 0.85),
            transform: "scale(1.1)",
          },

        "&:hover .app-catalogue-play-wave, &:focus-visible .app-catalogue-play-wave":
          {
            animation: `${playButtonWave} 1.45s ease-out infinite`,
          },

        "&:hover .app-catalogue-play-wave-late, &:focus-visible .app-catalogue-play-wave-late":
          {
            animationDelay: "0.5s",
          },

        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "-2px",
        },

        "@media (prefers-reduced-motion: reduce)": {
          "&:hover .app-catalogue-page-image, &:focus-visible .app-catalogue-page-image":
            {
              transform: "none",
            },

          "&:hover .app-catalogue-page-play-button, &:focus-visible .app-catalogue-page-play-button":
            {
              transform: "none",
            },

          "&:hover .app-catalogue-play-wave, &:focus-visible .app-catalogue-play-wave":
            {
              animation: "none",
            },
        },
      }}
    >
      <StatGradientDefs videoId={video._id} video={video} />

      {/* Thumbnail */}
      <Box
        onClick={watchVideo}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            watchVideo();
          }
        }}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
        }}
      >
        <Image
          className="app-catalogue-page-image"
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 600px) 100vw, 50vw"
          style={{
            objectFit: "contain",
            transition: "transform 0.3s ease",
          }}
        />
      </Box>

      {/* Centered play button */}
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: {
            xs: "calc(50% - 60px)",
            sm: "calc(50% - 60px)",
          },
          width: { xs: 64, sm: 72 },
          height: { xs: 64, sm: 72 },
          transform: "translateX(-50%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {[
          "app-catalogue-play-wave",
          "app-catalogue-play-wave app-catalogue-play-wave-late",
        ].map((waveClass) => (
          <Box
            key={waveClass}
            aria-hidden
            className={waveClass}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: "primary.main",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              transform: "scale(1)",
              transformOrigin: "center",
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        ))}

        <Box
          className="app-catalogue-page-play-button"
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            boxShadow: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: alpha("#fff", 0.7),
            transition: "all 0.3s ease",
          }}
        >
          <PlayArrowRoundedIcon
            sx={{
              fontSize: { xs: 54, sm: 54 },
              color: "primary.main",
            }}
          />
        </Box>
      </Box>

      {/* Stats */}
      <Stack
        direction="row"
        sx={{
          width: "100%",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            width: "100%",
            bgcolor: "#F9F9F9",
            borderRadius: "0px 0px 24px 24px",
            border: "3px solid #fff",
            boxShadow: "0px 0px 15px 10px rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            position: "relative",
            pt: 0.8,
            pb: 0,
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              gap: 0.5,
              mt: -1,
              justifyContent: "center",
            }}
          >
            {gradientColor(video).map((stat, index) => (
              <Button
                key={stat.label}
                disableRipple
                disableFocusRipple
                disableTouchRipple
                disableElevation
                sx={{
                  ...stackIcon,
                  minWidth: 0,
                  border: `2px solid ${alpha(stat.color[0], 0.2)}`,
                }}
              >
                <Stack
                  sx={{
                    p: 0.6,
                    borderRadius: "50%",
                    bgcolor: alpha(stat.color[0], 0.2),
                  }}
                >
                  <GradientIcon
                    icon={stat.icon}
                    id={`capacitor-stat-gradient-${video._id}-${index}`}
                  />
                </Stack>

                <Stack sx={{ flexDirection: "column" }}>
                  <Typography>{stat.number}</Typography>
                  <Typography component="span">{stat.label}</Typography>
                </Stack>
              </Button>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
