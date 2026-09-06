"use client";

import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { AppManagementVideoRecord } from "@/types/admin";

const SKELETON_COUNT = 6;
const SLIDE_HEIGHT = 120;
const SLIDE_WIDTH = Math.round((SLIDE_HEIGHT * 16) / 9);

type SuggestedVideosSwiperProps = {
  addLabel?: string;
  loading?: boolean;
  onAdd?: () => void;
  videos?: AppManagementVideoRecord[];
};

const slideSizeSx = {
  height: SLIDE_HEIGHT,
  width: SLIDE_WIDTH,
  flexShrink: 0,
  borderRadius: 2,
} as const;

const SuggestedVideosSwiper = ({
  addLabel = "Add Suggestion Video",
  loading = false,
  onAdd,
  videos = [],
}: SuggestedVideosSwiperProps) => {
  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        gap: 1.5,
        px: 2,
        "& .swiper": {
          width: "100%",
        },
        "& .swiper-slide": {
          width: "auto",
          height: SLIDE_HEIGHT,
        },
      }}
    >
      <Stack sx={{ alignItems: "center" }}>
        <Button variant="contained" color="primary" onClick={onAdd}>
          {addLabel}
        </Button>
      </Stack>

      {loading ? (
        <Stack direction="row" sx={{ gap: 1.5, overflow: "hidden" }}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <Skeleton
              key={`suggested-skeleton-${index}`}
              variant="rounded"
              animation="wave"
              sx={slideSizeSx}
            />
          ))}
        </Stack>
      ) : videos.length === 0 ? (
        <Stack
          sx={{
            position: "relative",
            width: "100%",
          }}
        >
          <Stack direction="row" sx={{ gap: 1.5, overflow: "hidden" }}>
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <Skeleton
                key={`suggested-empty-${index}`}
                variant="rounded"
                animation={false}
                sx={slideSizeSx}
              />
            ))}
          </Stack>
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1.5,
              textAlign: "center",
              color: "text.secondary",
              fontWeight: 600,
              pointerEvents: "none",
            }}
          >
            no videos are uploaded
          </Typography>
        </Stack>
      ) : (
        <Swiper slidesPerView="auto" spaceBetween={12}>
          {videos.map((video) => (
            <SwiperSlide key={video._id}>
              <Stack
                sx={{
                  position: "relative",
                  height: SLIDE_HEIGHT,
                  aspectRatio: "16 / 9",
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: 1,
                  cursor: "pointer",
                  "&:hover .suggested-video-name, &:focus-visible .suggested-video-name":
                    {
                      transform: "translateY(0)",
                    },
                }}
                tabIndex={0}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <Stack
                  className="suggested-video-name"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    px: 1,
                    py: 0.75,
                    boxSizing: "border-box",
                    bgcolor: "rgba(0, 0, 0, 0.55)",
                    transform: "translateY(100%)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "common.white",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {video.title}
                  </Typography>
                </Stack>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Stack>
  );
};

export default SuggestedVideosSwiper;
