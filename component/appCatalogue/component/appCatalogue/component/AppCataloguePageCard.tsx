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
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
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
  height: { xs: 40, sm: 45, lg: 48 },

  "& svg": {
    fontSize: { xs: 20, sm: 24, lg: 28 },
  },
  "& p": {
    color: "text.primary",
    fontWeight: 800,
    fontSize: { xs: 12, sm: 14, lg: 15 },
    lineHeight: 1,
  },
  "& span": {
    color: "text.secondary",
    fontWeight: 800,
    fontSize: { xs: 10, sm: 12, lg: 13 },
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
            key={stat.number}
            id={`page-stat-gradient-${videoId}-${index}`}
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

export default function AppCataloguePageCard({ video }: { video: VideoData }) {
  const router = useRouter();
  console.log(video);
  return (
    <Stack
      tabIndex={0}
      role="button"
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: 6,
        boxShadow: 3,
        overflow: "hidden",
        bgcolor: "white",
        "&:hover": {
          boxShadow: (theme) =>
            `0px 2px 10px 1px ${theme.palette.primary.main}`,
          "& .app-catalogue-page-image": {
            transition: "all 0.3s ease",
            transform: "scale(1.1) rotate(3deg)",
          },
          "& .app-catalogue-page-play-button": {
            bgcolor: alpha("#fff", 0.85),
            scale: 1.1,
            transition: "all 0.3s ease",
          },
          "& .app-catalogue-play-wave": {
            animationName: `${playButtonWave}`,
            animationDuration: "1.45s",
            animationTimingFunction: "ease-out",
            animationIterationCount: "infinite",
          },
          "& .app-catalogue-play-wave-late": {
            animationDelay: "0.5s",
          },
        },
        transition: "all 0.35s ease",
      }}
    >
      <StatGradientDefs videoId={video._id} video={video} />
      <Stack
        onClick={() => router.push(`/app/watch/${video._id}`)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            router.push(`/app/watch/${video._id}`);
          }
        }}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <Image
          className="app-catalogue-page-image"
          src={video.thumbnail}
          alt={video.title}
          fill
          style={{ objectFit: "contain" }}
        />
      </Stack>

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: {
            xs: "calc(50% - 60px)",
            sm: "calc(50% - 60px)",
            lg: "calc(50% - 68px)",
          },
          width: { xs: 64, sm: 68, lg: 75 },
          height: { xs: 64, sm: 68, lg: 75 },
          transform: "translateX(-50%)",
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
            cursor: "pointer",
          }}
        >
          <PlayArrowRoundedIcon
            sx={{
              fontSize: { xs: 54, md: 48, lg: 54, xl: 64 },
              color: "primary.main",
            }}
          />
        </Box>
      </Box>

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
            pt: { xs: 1, sm: 1 },
            pb: { xs: 0, sm: 0 },
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              gap: { xs: 0.5, sm: 1, lg: 1.5 },
              mt: -1,
              justifyContent: "center",
            }}
          >
            {gradientColor(video).map((stat, index) => (
              <Button
                key={index}
                disableRipple
                disableFocusRipple
                disableTouchRipple
                disableElevation
                sx={{
                  ...stackIcon,
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
                    id={`page-stat-gradient-${video._id}-${index}`}
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
