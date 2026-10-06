"use client";

import { Button, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { AdminDonationCommentRecord } from "@/types/admin";

const SKELETON_COUNT = 6;
const SLIDE_HEIGHT = 120;
const SLIDE_WIDTH = Math.round((SLIDE_HEIGHT * 16) / 9);

type CommentSwiperProps = {
  addLabel?: string;
  loading?: boolean;
  errorMsg?: string;
  onAdd?: () => void;
  comments?: AdminDonationCommentRecord[];
};

const slideSizeSx = {
  height: SLIDE_HEIGHT,
  width: SLIDE_WIDTH,
  flexShrink: 0,
  borderRadius: 2,
} as const;

const CommentSwiper = ({
  addLabel = "Add Comment",
  loading = false,
  errorMsg = "",
  onAdd,
  comments = [],
}: CommentSwiperProps) => {
  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        gap: 0.8,
        px: 2,
        "& .swiper": {
          width: "100%",
          py: 1.5,
        },
        "& .swiper-slide": {
          width: "auto",
          height: SLIDE_HEIGHT,
          aspectRatio: "16 / 9",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: 5,
        },
      }}
    >
      <Divider flexItem sx={{ width: "95%", mx: "auto" }}>
        <Stack sx={{ alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onAdd}
            sx={{
              width: 200,
              boxShadow: (theme) =>
                `0px 2px 12px 1px ${theme.palette.primary.main}`,
            }}
          >
            {addLabel}
          </Button>
        </Stack>
      </Divider>

      {loading ? (
        <Stack direction="row" sx={{ gap: 1.5, overflow: "hidden" }}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <Skeleton
              key={`comment-skeleton-${index}`}
              variant="rounded"
              animation="wave"
              sx={slideSizeSx}
            />
          ))}
        </Stack>
      ) : comments.length === 0 ? (
        <Stack
          sx={{
            position: "relative",
            width: "100%",
          }}
        >
          <Stack direction="row" sx={{ gap: 1.5, overflow: "hidden" }}>
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <Skeleton
                key={`comment-empty-${index}`}
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
              color: errorMsg ? "error.main" : "text.secondary",
              fontWeight: 600,
              pointerEvents: "none",
            }}
          >
            {errorMsg || "no comments are added"}
          </Typography>
        </Stack>
      ) : (
        <Swiper slidesPerView="auto" spaceBetween={12}>
          {comments.map((comment) => (
            <SwiperSlide key={comment._id}>
              <Stack
                sx={{
                  position: "relative",
                  height: SLIDE_HEIGHT,
                  width: "100%",
                  p: 1.2,
                  boxSizing: "border-box",
                  bgcolor: "background.paper",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  cursor: "pointer",
                  "&:hover .comment-username, &:focus-visible .comment-username":
                    {
                      transform: "translateY(1px)",
                    },
                }}
                tabIndex={0}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-word",
                    lineHeight: 1.6,
                  }}
                >
                  {comment.text || "No text"}
                </Typography>
                <Stack
                  className="comment-username"
                  direction="row"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    px: 1,
                    py: 0.75,
                    gap: 1,
                    alignItems: "center",
                    boxSizing: "border-box",
                    bgcolor: "rgba(0, 0, 0, 0.55)",
                    transform: "translateY(102%)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {comment.avatar ? (
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  ) : null}
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
                    {comment.username}
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

export default CommentSwiper;
