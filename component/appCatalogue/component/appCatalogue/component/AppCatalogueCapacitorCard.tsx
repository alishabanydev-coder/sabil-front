"use client";

import {
  alpha,
  Box,
  Button,
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
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import type { VideoData } from "../../navbarTypes";

type GradientStat = {
  number: string;
  icon: ElementType<SvgIconProps>;
  color: [string, string];
};

const gradientColor: GradientStat[] = [
  {
    number: "856",
    icon: BookmarkOutlinedIcon,
    color: ["#0F70E3", "#044CD4"],
  },
  { number: "2.1k", icon: FavoriteRoundedIcon, color: ["#FB5C73", "#FB2C5C"] },
  {
    number: "12.4k",
    icon: VisibilityRoundedIcon,
    color: ["#7E4DDE", "#6C32C9"],
  },
];

//FIXME: make this card like the catalogue page card

const stackIcon = {
  flexDirection: "row",
  my: 0.5,
  gap: 0.5,
  alignItems: "center",
  pr: 1,
  pl: 0.3,
  height: 32,
  borderRadius: 4,

  "& svg": {
    fontSize: 20,
  },
  "& p": {
    color: "text.primary",
    fontWeight: 800,
    fontSize: 14,
    lineHeight: 1,
  },
  "& span": {
    color: "text.secondary",
    fontWeight: 800,
    fontSize: 11,
    lineHeight: 1,
  },
};

function StatGradientDefs({ videoId }: { videoId: string }) {
  return (
    <svg
      aria-hidden
      focusable={false}
      width={0}
      height={0}
      style={{ position: "absolute" }}
    >
      <defs>
        {gradientColor.map((stat, index) => (
          <linearGradient
            key={stat.number}
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

export default function AppCatalogueCapacitorCard({
  video,
}: {
  video: VideoData;
}) {
  const router = useRouter();

  return (
    <Stack
      onClick={() => router.push(`/app/watch/${video._id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/app/watch/${video._id}`);
        }
      }}
      tabIndex={0}
      role="button"
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: 6,
        boxShadow: 3,
        cursor: "pointer",
        bgcolor: "white",
        overflow: "hidden",
        "&:hover": {
          boxShadow: (theme) =>
            `0px 2px 10px 1px ${theme.palette.primary.main}`,
          "& .app-catalogue-page-image": {
            transition: "all 0.3s ease",
            transform: "scale(1.1) rotate(3deg)",
          },
          "& .app-catalogue-page-play-button": {
            transform: "translateY(0)",
            scale: 1.1,
            transition: "all 0.3s ease",
          },
          transition: "all 0.3s ease",
        },
      }}
    >
      <StatGradientDefs videoId={video._id} />
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: { xs: -24, sm: "calc(50% - 68px)" },
          width: { xs: 50, sm: 72 },
          height: { xs: 50, sm: 72 },
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
              fontSize: { xs: 40, md: 24, lg: 34, xl: 64 },
              color: "primary.main",
            }}
          />
        </Box>
      </Box>
      <Box
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
          style={{ objectFit: "contain" }}
        />
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
            bgcolor: "#F9F9F9",
            borderRadius: "0px 0px 24px 24px",
            border: "3px solid #fff",
            boxShadow: "0px 0px 15px 10px rgba(0, 0, 0, 0.5)",
            width: "100%",
            pl: 7,
            pr: 1.5,
            position: "relative",
            pt: 0.4,
            flexShrink: 0,
          }}
          data-catalogue-title
        >
          <Stack
            sx={{
              flexDirection: "row",
              gap: 0.8,
              mt: -0.5,
              ml: -0.5,
            }}
          >
            {gradientColor.map((stat, index) => (
              <Button
                key={index}
                sx={{
                  ...stackIcon,
                  backgroundColor: alpha(stat.color[0], 0.15),
                }}
              >
                <Stack
                  sx={{
                    p: 0.45,
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
                  <Typography sx={{ fontSize: 12, lineHeight: 1 }}>
                    {stat.number}
                  </Typography>
                </Stack>
              </Button>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
