"use client";

import WatchPlayerPlayIcon from "@/component/appCatalogue/watch/WatchPlayerPlayIcon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Avatar, Divider, Stack, Typography } from "@mui/material";
import { useLayoutEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type DonationUpdate = {
  id: string;
  refType: "Blog" | "BreakDown";
  order: number;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorAvatar?: string;
  subHeader?: string;
  images: string[];
  videoUrl?: string;
};

type UpdateCardProps = {
  update: DonationUpdate;
  updateNumber: number;
};


const formatUpdateDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString().slice(0, 10);
};

const UpdateMediaSwiper = ({
  title,
  images,
  videoUrl,
  isExpanded,
}: {
  title: string;
  images: string[];
  videoUrl?: string;
  isExpanded: boolean;
}) => {
  const hasVideo =
    typeof videoUrl === "string" && videoUrl.trim().length > 0;
  const mediaCount = (hasVideo ? 1 : 0) + images.length;

  if (mediaCount === 0) {
    return null;
  }

  if (mediaCount === 1 && !hasVideo) {
    return (
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "grey.100",
        }}
      >
        <img
          src={images[0]}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "black",
        "& .swiper-pagination-bullet": {
          bgcolor: "grey.500",
          opacity: 1,
          width: 12,
          height: 12,
        },
        "& .swiper-pagination-bullet-active": {
          width: 15,
          height: 15,
          bgcolor: "primary.main",
        },
        "& .swiper-button-prev, & .swiper-button-next": {
          color: "primary.main",
        },
        "& .swiper-button-prev::after, & .swiper-button-next::after": {
          fontSize: "18px",
          fontWeight: 700,
        },
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        style={{ width: "100%", height: "100%" }}
        navigation={mediaCount > 1}
        pagination={mediaCount > 1 ? { clickable: true } : false}
      >
        {hasVideo ? (
          <SwiperSlide style={{ width: "100%", height: "100%" }}>
            <ReactPlayer
              src={videoUrl}
              light={
                images[0] ? (
                  <img
                    src={images[0]}
                    alt={title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  true
                )
              }
              playIcon={<WatchPlayerPlayIcon />}
              previewAriaLabel={`Play ${title}`}
              controls
              width="100%"
              height="100%"
              playing={isExpanded}
            />
          </SwiperSlide>
        ) : null}

        {images.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`} style={{ height: "100%" }}>
            <img
              src={image}
              alt={`${title} ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Stack>
  );
};

const COLLAPSED_HEIGHT = 400;
const EXPAND_TRANSITION = "max-height 0.45s ease, box-shadow 0.3s ease";

const UpdateCard = ({ update, updateNumber }: UpdateCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | string>(COLLAPSED_HEIGHT);

  const showMedia = isExpanded || isCollapsing;

  const measureCardHeight = () => {
    const card = cardRef.current;
    if (!card) {
      return COLLAPSED_HEIGHT;
    }

    const previousMaxHeight = card.style.maxHeight;
    card.style.maxHeight = "none";
    const height = card.scrollHeight;
    card.style.maxHeight = previousMaxHeight;

    return height;
  };

  useLayoutEffect(() => {
    if (!isExpanded || isCollapsing) {
      return;
    }

    const fullHeight = measureCardHeight();
    setMaxHeight(COLLAPSED_HEIGHT);

    const frame = requestAnimationFrame(() => {
      setMaxHeight(fullHeight);
    });

    return () => cancelAnimationFrame(frame);
  }, [isExpanded, isCollapsing, showMedia]);

  const toggleExpanded = () => {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    if (isExpanded && !isCollapsing) {
      setIsCollapsing(true);
      setMaxHeight(card.scrollHeight);

      requestAnimationFrame(() => {
        setMaxHeight(COLLAPSED_HEIGHT);
      });
      return;
    }

    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (event.propertyName !== "max-height") {
      return;
    }

    if (isCollapsing) {
      setIsExpanded(false);
      setIsCollapsing(false);
      setMaxHeight(COLLAPSED_HEIGHT);
      return;
    }

    if (isExpanded) {
      setMaxHeight("none");
    }
  };

  return (
    <Stack
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onClick={toggleExpanded}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleExpanded();
        }
      }}
      onTransitionEnd={handleTransitionEnd}
      sx={{
        bgcolor: "background.default",
        position: "relative",
        width: "95%",
        mx: "auto",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        boxShadow: isExpanded && !isCollapsing ? 4 : 2,
        gap: 2,
        cursor: "pointer",
        maxHeight,
        overflow: "hidden",
        transition: EXPAND_TRANSITION,
      }}
    >
      <Stack ref={contentRef} sx={{ gap: 2 }}>
      <Stack sx={{ gap: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 },
            color: "text.secondary",
          }}
        >
          update #{updateNumber}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Namecat",
            letterSpacing: 1.5,
            fontSize: { xs: 12, sm: 16, md: 18, lg: 24, xl: 28 },
            color: "primary.main",
          }}
        >
          {update.title}
        </Typography>
        {update.subHeader?.trim() ? (
          <Typography
            sx={{
              fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 },
              color: "text.secondary",
            }}
          >
            {update.subHeader}
          </Typography>
        ) : null}
      </Stack>

      <Stack sx={{ flexDirection: "row", gap: 1 }}>
        <Avatar
          src={update.authorAvatar || "/avatar1.webp"}
          sx={{
            width: { xs: 32, sm: 40, md: 48, lg: 56, xl: 64 },
            height: { xs: 32, sm: 40, md: 48, lg: 56, xl: 64 },
          }}
        />
        <Stack>
          <Typography
            sx={{ fontSize: { xs: 11, sm: 14, md: 16, lg: 18, xl: 24 } }}
          >
            {update.authorName}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 },
              fontWeight: 300,
              color: "text.secondary",
            }}
          >
            {formatUpdateDate(update.createdAt)}
          </Typography>
        </Stack>
      </Stack>

      <Divider flexItem />

      <Stack sx={{ gap: 2 }}>
        {showMedia ? (
          <UpdateMediaSwiper
            title={update.title}
            images={update.images}
            videoUrl={update.videoUrl}
            isExpanded={isExpanded && !isCollapsing}
          />
        ) : null}

        <Typography
          sx={{
            fontSize: { xs: 11, sm: 14, md: 16, lg: 18, xl: 24 },
            fontWeight: 300,
            width: "100%",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {update.content}
        </Typography>
      </Stack>
      </Stack>

      <Stack
        aria-hidden
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 96,
          pointerEvents: "none",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          alignItems: "center",
          justifyContent: "flex-end",
          pb: 0.5,
          opacity: isExpanded && !isCollapsing ? 0 : 1,
          transition: "opacity 0.35s ease",
          background: (theme) =>
            `linear-gradient(to top, ${theme.palette.common.white}, transparent)`,
        }}
      >
        <KeyboardArrowDownIcon
          sx={{
            color: "primary.main",
            fontSize: { xs: 28, sm: 32 },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default UpdateCard;
