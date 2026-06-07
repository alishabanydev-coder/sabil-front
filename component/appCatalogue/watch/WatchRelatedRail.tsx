import {
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { WatchCatalogueVideo } from "./buildWatchRelatedVideos";

const SKELETON_COUNT = 6;
const MOBILE_SKELETON_COUNT = 4;

type WatchRelatedRailProps = {
  videos: WatchCatalogueVideo[];
  isLoading: boolean;
};

const slideStyle = { width: "auto", height: "100%" };

const WatchRelatedRail = ({ videos, isLoading }: WatchRelatedRailProps) => {
  const router = useRouter();

  return (
    <Stack
      sx={{
        width: "100%",
        height: { xs: "100%", sm: "100%" },
        minHeight: { xs: 0, sm: 0 },
        overflow: { xs: "hidden", sm: "visible" },
        "& .swiper": {
          px: 2,
          py: 1.5,
          width: "100%",
          height: { xs: "auto", sm: "100%" },
        },
      }}
    >
      <Stack
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          rowGap: 1,
          columnGap: 1,
          width: "100%",
          height: "100%",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: 2,
          py: 1.5,
          WebkitOverflowScrolling: "touch",
        }}
      >
          {isLoading
            ? Array.from({ length: MOBILE_SKELETON_COUNT }, (_, index) => (
                <Stack key={`mobile-skeleton-${index}`}>
                  <Stack
                    sx={{
                      width: { xs: 160, sm: 180, md: 240 },
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      overflow: "hidden",
                      gap: 0.5,
                    }}
                  >
                    <Stack
                      sx={{
                        position: "relative",
                        width: "100%",
                        flexShrink: 0,
                        aspectRatio: "16 / 9",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </Stack>
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                        gap: 0.5,
                        px: 0.5,
                        pb: 0.5,
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        animation="wave"
                        sx={{ width: 28, height: 28 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{ width: "100%", height: 28, borderRadius: 2 }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              ))
            : videos.map((item) => {
                const cardProjectLogo = item.projectThumbnail?.trim() || "";
                const cardProjectName = item.projectTitle?.trim() || "Project";
                return (
                  <Stack key={item._id}>
                    <Stack
                      onClick={() => router.push(`/app/watch/${item._id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(`/app/watch/${item._id}`);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      sx={{
                        width: { xs: 160, sm: 180, md: 240 },
                        height: { xs: "auto", sm: "100%" },
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                        cursor: "pointer",
                        gap: 0.5,
                        transition: "box-shadow 0.2s ease",
                        "&:hover": {
                          boxShadow: (theme) =>
                            `0 2px 8px 1px ${theme.palette.primary.main}`,
                        },
                      }}
                    >
                      <Stack
                        sx={{
                          position: "relative",
                          width: "100%",
                          flex: { xs: "0 0 auto", sm: 1 },
                          minHeight: { xs: "auto", sm: 0 },
                          aspectRatio: "16 / 9",
                          bgcolor: "action.hover",
                        }}
                      >
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            sizes="100px"
                            style={{ objectFit: "contain" }}
                          />
                        ) : null}
                      </Stack>
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          gap: 0.5,
                          px: 0.5,
                          pb: 0.5,
                          minHeight: { xs: 28, sm: 32, md: 40 },
                        }}
                      >
                        {cardProjectLogo ? (
                          <Image
                            src={cardProjectLogo}
                            alt={cardProjectName}
                            width={28}
                            height={28}
                            style={{
                              objectFit: "contain",
                              borderRadius: "50%",
                            }}
                          />
                        ) : null}
                        <Typography
                          sx={{
                            fontSize: { xs: 10, sm: 12, md: 14 },
                            fontWeight: 500,
                            color: "#777",
                          }}
                        >
                          {`S${item.season}-E${item.episode} |`}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: { xs: 10, sm: 12, md: 14 },
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "50%",
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })}
      </Stack>

      <Stack
        sx={{
          display: { xs: "none", sm: "block" },
          width: "100%",
          height: "100%",
          minHeight: 0,
        }}
      >
        <Swiper slidesPerView="auto" spaceBetween={12}>
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <SwiperSlide key={`skeleton-${index}`} style={slideStyle}>
                  <Stack
                    sx={{
                      width: { xs: 140, sm: 180, md: 240 },
                      height: { xs: "auto", sm: "100%" },
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      overflow: "hidden",
                      gap: 0.5,
                    }}
                  >
                    <Stack
                      sx={{
                        position: "relative",
                        width: "100%",
                        flexShrink: 0,
                        aspectRatio: "16 / 9",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </Stack>

                    <Stack
                      direction={"row"}
                      sx={{ alignItems: "center", gap: 0.5, px: 0.5, pb: 0.5 }}
                    >
                      <Skeleton
                        variant="circular"
                        sx={{
                          width: { xs: 28, sm: 32, md: 36 },
                          height: { xs: 28, sm: 32, md: 36 },
                        }}
                      />
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          width: "100%",
                          height: { xs: 28, sm: 32, md: 36 },
                          borderRadius: 2,
                        }}
                      />
                    </Stack>
                  </Stack>
                </SwiperSlide>
              ))
            : videos.map((item) => {
                const cardProjectLogo = item.projectThumbnail?.trim() || "";
                const cardProjectName = item.projectTitle?.trim() || "Project";

                return (
                  <SwiperSlide key={item._id} style={slideStyle}>
                    <Stack
                      onClick={() => router.push(`/app/watch/${item._id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(`/app/watch/${item._id}`);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      sx={{
                        width: { xs: 140, sm: 180, md: 240 },
                        height: { xs: "auto", sm: "100%" },
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                        cursor: "pointer",
                        gap: 0.5,
                        transition: "box-shadow 0.2s ease",
                        "&:hover": {
                          boxShadow: (theme) =>
                            `0 2px 8px 1px ${theme.palette.primary.main}`,
                        },
                      }}
                    >
                      <Stack
                        sx={{
                          position: "relative",
                          width: "100%",
                          flex: { xs: "0 0 auto", sm: 1 },
                          minHeight: { xs: "auto", sm: 0 },
                          aspectRatio: "16 / 9",
                          bgcolor: "action.hover",
                        }}
                      >
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            sizes="240px"
                            style={{ objectFit: "contain" }}
                          />
                        ) : null}
                      </Stack>
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          gap: 0.5,
                          px: 0.5,
                          pb: 0.5,
                          minHeight: { xs: 28, sm: 32, md: 40 },
                        }}
                      >
                        {cardProjectLogo ? (
                          <Image
                            src={cardProjectLogo}
                            alt={cardProjectName}
                            width={28}
                            height={28}
                            style={{
                              objectFit: "contain",
                              borderRadius: "50%",
                            }}
                          />
                        ) : null}
                        <Typography
                          sx={{
                            fontSize: { xs: 10, sm: 12, md: 14 },
                            fontWeight: 500,
                            color: "#777",
                          }}
                        >
                          {`S${item.season}-E${item.episode}`}
                        </Typography>
                        {"|"}
                        <Typography
                          sx={{
                            fontSize: { xs: 10, sm: 12, md: 14 },
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Stack>
                    </Stack>
                  </SwiperSlide>
                );
              })}
        </Swiper>
      </Stack>
    </Stack>
  );
};

export default WatchRelatedRail;
