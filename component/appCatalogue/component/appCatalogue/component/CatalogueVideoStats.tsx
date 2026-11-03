"use client";

import { useVideoReaction } from "@/component/appCatalogue/hooks/useVideoReaction";
import type { VideoData } from "@/component/appCatalogue/component/navbarTypes";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  alpha,
  Button,
  CircularProgress,
  Stack,
  Typography,
  type SvgIconProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import { type ElementType, type MouseEvent } from "react";
import { compactStat } from "./compactStat";

type StatVariant = "page" | "capacitor" | "watch";
type ReactionKind = "save" | "like" | "view";

type StatConfig = {
  kind: ReactionKind;
  color: [string, string];
  label: string;
  idleIcon: ElementType<SvgIconProps>;
  activeIcon: ElementType<SvgIconProps>;
};

const STATS: StatConfig[] = [
  {
    kind: "save",
    color: ["#0F70E3", "#044CD4"],
    label: "save",
    idleIcon: BookmarkBorderOutlinedIcon,
    activeIcon: BookmarkOutlinedIcon,
  },
  {
    kind: "like",
    color: ["#FB5C73", "#FB2C5C"],
    label: "likes",
    idleIcon: FavoriteBorderRoundedIcon,
    activeIcon: FavoriteRoundedIcon,
  },
  {
    kind: "view",
    color: ["#7E4DDE", "#6C32C9"],
    label: "views",
    idleIcon: VisibilityRoundedIcon,
    activeIcon: VisibilityRoundedIcon,
  },
];

const BUTTON_SX: Record<StatVariant, SxProps<Theme>> = {
  page: {
    flexDirection: "row",
    my: 0.5,
    gap: 0.5,
    alignItems: "center",
    px: 1.4,
    pl: 0.5,
    borderRadius: 6,
    height: { xs: 40, sm: 45, lg: 48 },
    minWidth: 0,
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
  },
  capacitor: {
    flexDirection: "row",
    my: 0.5,
    gap: 0.5,
    alignItems: "center",
    px: 1.4,
    pl: 0.5,
    borderRadius: 6,
    height: 40,
    minWidth: 0,
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
  },
  watch: {
    flexDirection: "row",
    gap: 0.5,
    alignItems: "center",
    px: 1.2,
    pl: 0.4,
    borderRadius: 6,
    height: 36,
    minWidth: 0,
    bgcolor: "rgba(255, 255, 255, 0.92)",
    "& svg": {
      fontSize: 18,
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
  },
};

function GradientIcon({
  icon: Icon,
  id,
}: {
  icon: ElementType<SvgIconProps>;
  id: string;
}) {
  return <Icon style={{ fill: `url(#${id})` }} />;
}

function ViewStatButton({
  videoId,
  variant,
  stat,
  index,
  count,
}: {
  videoId: string;
  variant: StatVariant;
  stat: StatConfig;
  index: number;
  count: number;
}) {
  const gradientId = `${variant}-stat-gradient-${videoId}-${index}`;

  return (
    <Button
      type="button"
      disableRipple
      disableFocusRipple
      disableTouchRipple
      disableElevation
      tabIndex={-1}
      aria-label={stat.label}
      sx={{
        ...BUTTON_SX[variant],
        border: `2px solid ${alpha(stat.color[0], 0.2)}`,
        pointerEvents: "none",
      }}
    >
      <Stack
        sx={{
          p: 0.6,
          borderRadius: "50%",
          bgcolor: alpha(stat.color[0], 0.2),
        }}
      >
        <GradientIcon icon={stat.idleIcon} id={gradientId} />
      </Stack>
      <Stack sx={{ flexDirection: "column" }}>
        <Typography>{compactStat(count)}</Typography>
        <Typography component="span">{stat.label}</Typography>
      </Stack>
    </Button>
  );
}

function ReactionStatButton({
  videoId,
  variant,
  stat,
  index,
  count,
}: {
  videoId: string;
  variant: StatVariant;
  stat: StatConfig;
  index: number;
  count: number;
}) {
  const reaction = useVideoReaction(
    videoId,
    stat.kind === "save" ? "save" : "like",
    count
  );
  const Icon = reaction.active ? stat.activeIcon : stat.idleIcon;
  const gradientId = `${variant}-stat-gradient-${videoId}-${index}`;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (reaction.pending) {
      return;
    }
    void reaction.toggle();
  };

  return (
    <Button
      type="button"
      disableRipple
      disableFocusRipple
      disableTouchRipple
      disableElevation
      disabled={reaction.pending}
      aria-pressed={reaction.active}
      aria-busy={reaction.pending || undefined}
      aria-label={stat.label}
      onClick={handleClick}
      sx={{
        ...BUTTON_SX[variant],
        border: `2px solid ${alpha(stat.color[0], 0.2)}`,
        opacity: reaction.pending ? 0.75 : 1,
        "&.Mui-disabled": {
          color: "inherit",
        },
      }}
    >
      <Stack
        sx={{
          position: "relative",
          p: 0.6,
          borderRadius: "50%",
          bgcolor: alpha(stat.color[0], 0.2),
        }}
      >
        {reaction.pending ? (
          <CircularProgress
            size="1em"
            thickness={5}
            sx={{
              "&&": {
                fontSize: {
                  page: { xs: 20, sm: 24, lg: 28 },
                  capacitor: 20,
                  watch: 18,
                }[variant],
              },
              "& .MuiCircularProgress-circle": {
                stroke: `url(#${gradientId})`,
              },
            }}
          />
        ) : (
          <GradientIcon icon={Icon} id={gradientId} />
        )}
      </Stack>
      <Stack sx={{ flexDirection: "column" }}>
        <Typography>{compactStat(reaction.count)}</Typography>
        <Typography component="span">{stat.label}</Typography>
      </Stack>
    </Button>
  );
}

export default function CatalogueVideoStats({
  video,
  variant,
  showViews = true,
}: {
  video: Pick<
    VideoData,
    "_id" | "localLikeCount" | "likeCount" | "saveCount" | "viewCount"
  >;
  variant: StatVariant;
  showViews?: boolean;
}) {
  const videoId = video._id;
  const stats = showViews
    ? STATS
    : STATS.filter((stat) => stat.kind !== "view");
  const counts: Record<ReactionKind, number> = {
    save: Number(video.saveCount) || 0,
    like: (Number(video.localLikeCount) || 0) + (Number(video.likeCount) || 0),
    view: Number(video.viewCount) || 0,
  };

  return (
    <>
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
              key={stat.kind}
              id={`${variant}-stat-gradient-${videoId}-${index}`}
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
    </>
  );
}
