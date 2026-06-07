import { Modal, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import ReactPlayer from "react-player";
import WatchPlayerPlayIcon from "@/component/appCatalogue/watch/WatchPlayerPlayIcon";
import { Navigation, Pagination } from "swiper/modules";

type BlogDataItem = {
  _id: string;
  title?: string;
  images?: string;
  image?: string[];
  content?: string;
  videoUrl?: string;
};

const style = {
  direction: "ltr",
  width: "min(92vw, 960px)",
  maxHeight: "90vh",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  px: { xs: 2, md: 3 },
  py: 2,
  gap: 1,
  overflowY: "auto",
};

const NewsFromUsModal = ({
  open,
  onClose,
  selectedBlog,
}: {
  open: boolean;
  onClose: () => void;
  selectedBlog: BlogDataItem;
}) => {
  const selectedBlogImages = Array.isArray(selectedBlog?.image)
    ? selectedBlog.image.filter((img) => typeof img === "string" && img.trim())
    : typeof selectedBlog?.images === "string" && selectedBlog.images.trim()
      ? [selectedBlog.images]
      : [];
  return (
    <Modal open={open} onClose={onClose}>
      <Stack sx={style}>
        <Stack
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "black",
            flexShrink: 0,
            minHeight: 220,
            "& .swiper-pagination-bullet": {
              bgcolor: "grey.800",
              opacity: 1,
            },
            "& .swiper-pagination-bullet-active": {
              bgcolor: "primary.main",
              width: "10px",
              height: "10px",
            },
            "& .swiper-button-prev, & .swiper-button-next": {
              color: "primary.main",
            },
            "& .swiper-button-prev::after, & .swiper-button-next::after": {
              fontSize: "20px",
              fontWeight: 700,
            },
          }}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            style={{ width: "100%", height: "100%" }}
            navigation
            pagination={{ clickable: true }}
          >
            {selectedBlog?.videoUrl && (
              <SwiperSlide
                key={selectedBlog?.videoUrl}
                style={{ width: "100%", height: "100%" }}
              >
                <ReactPlayer
                  src={selectedBlog?.videoUrl}
                  playIcon={<WatchPlayerPlayIcon />}
                  previewAriaLabel={`Play ${selectedBlog?.title || "news from us video"}`}
                  controls
                  width="100%"
                  height="100%"
                  playing={open}
                />
              </SwiperSlide>
            )}
            {selectedBlogImages.map((image) => (
              <SwiperSlide key={image} style={{ height: "100%" }}>
                <Stack
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100% !important",
                    minHeight: 280,
                  }}
                >
                  <img
                    src={image}
                    alt={selectedBlog?.title || "Blog image"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Stack>
              </SwiperSlide>
            ))}
            {selectedBlogImages.length === 0 ? (
              <SwiperSlide>
                <Stack
                  sx={{
                    width: "100%",
                    minHeight: 280,
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                  }}
                >
                  <Typography color="text.secondary">
                    No image available
                  </Typography>
                </Stack>
              </SwiperSlide>
            ) : null}
          </Swiper>
        </Stack>
        <Typography
          sx={{ fontSize: 24, fontWeight: 700, color: "primary.main" }}
        >
          {selectedBlog?.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
            color: "text.primary",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {selectedBlog?.content}
        </Typography>
      </Stack>
    </Modal>
  );
};

export default NewsFromUsModal;
