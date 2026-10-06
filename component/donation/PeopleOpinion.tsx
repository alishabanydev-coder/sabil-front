"use client";

import { alpha, Avatar, Stack, Typography } from "@mui/material";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type { PublicComment } from "./services/commentsPublicApi";

type PeopleOpinionProps = {
  comments?: PublicComment[];
  errorMsg?: string;
};

const PeopleOpinion = ({
  comments = [],
  errorMsg = "",
}: PeopleOpinionProps) => {
  return (
    <Stack
      sx={{
        borderColor: (theme) => theme.palette.primary.main,
        borderWidth: 2,
        borderStyle: "solid",
        borderRadius: 5,
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
        px: { xs: 1.5, sm: 2 },
        py: { xs: 3, sm: 4 },
        gap: 2,
        direction: "ltr",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Arco",
            fontSize: { xs: 20, sm: 24, md: 32, lg: 36, xl: 42 },
            color: "primary.main",
          }}
        >
          People's Opinion
        </Typography>
      </Stack>

      {comments.length === 0 ? (
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontFamily: "Namecat",
          }}
        >
          {errorMsg || "No opinions yet."}
        </Typography>
      ) : (
        <Stack
          sx={{
            width: "100%",
            alignItems: "center",
            "& .swiper": {
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: 2,
              pb: 4,
              px: 2,
            },
            "& .swiper-wrapper": {
              alignItems: "center",
            },
            "& .swiper-slide": {
              height: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", sm: 280, md: "auto" },
            },
            "& .swiper-pagination": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& .swiper-pagination-bullet": {
              bgcolor: "#aaa",
              opacity: 1,
              width: 10,
              height: 10,
              transition: "transform 0.3s ease, background-color 0.3s ease",
            },
            "& .swiper-pagination-bullet-active": {
              bgcolor: "primary.main",
              transform: "scale(1.5)",
            },
          }}
        >
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={1}
            spaceBetween={45}
            watchOverflow
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 30 },
              600: { slidesPerView: "auto", spaceBetween: 40 },
              900: { slidesPerView: 3, spaceBetween: 45 },
            }}
          >
            {comments.map((comment) => (
              <SwiperSlide key={comment._id}>
                <Stack
                  sx={{
                    width: "100%",
                    height: "100%",
                    minHeight: { xs: 200, sm: 280 },
                    p: 3,
                    gap: 1.5,
                    alignItems: "center",
                    bgcolor: "background.paper",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 8,
                    boxShadow: (theme) =>
                      `0 3px 20px 0 ${alpha(theme.palette.primary.main, 0.7)}`,
                    boxSizing: "border-box",
                  }}
                >
                  <Typography
                    sx={{
                      flex: 1,
                      width: "100%",
                      fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
                      color: "text.primary",
                      fontFamily: "Namecat",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      wordBreak: "break-word",
                      lineHeight: 1.6,
                      textAlign: "start",
                    }}
                  >
                    {comment.text}
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "start",
                      justifyContent: "start",
                      gap: 1,
                      minWidth: 0,
                      width: "100%",
                    }}
                  >
                    <Avatar
                      src={comment.avatar}
                      alt={comment.username}
                      sx={{
                        width: { xs: 32, sm: 36, md: 42, lg: 48, xl: 52 },
                        height: { xs: 32, sm: 36, md: 42, lg: 48, xl: 52 },
                        bgcolor: "secondary.main",
                        color: "#fff",
                      }}
                    />
                    <Stack>
                      <Typography
                        sx={{
                          fontFamily: "Namecat",
                          fontWeight: 700,
                          fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {comment.username}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: "Namecat",
                          overflow: "hidden",
                          color: "text.secondary",
                          fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 },
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Sabeel User
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </SwiperSlide>
            ))}
          </Swiper>
        </Stack>
      )}
    </Stack>
  );
};

export default PeopleOpinion;
