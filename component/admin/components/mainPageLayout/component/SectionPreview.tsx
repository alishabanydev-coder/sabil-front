import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { MouseEvent } from "react";
import type {
  AdminProjectRecord,
  MainPageLayoutItem,
  MainPageLayoutSection,
} from "@/types/admin";

type SectionPreviewProps = {
  section: MainPageLayoutSection;
  items: MainPageLayoutItem[];
  loading: boolean;
  selectedProject: AdminProjectRecord | null;
  onOpen: (section: MainPageLayoutSection) => void;
  onDelete: (sectionName: string, itemId: string) => void;
  onProjectMenuClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

const SectionPreview = ({
  section,
  items,
  loading,
  selectedProject,
  onOpen,
  onDelete,
  onProjectMenuClick,
}: SectionPreviewProps) => {
  return (
    <Stack>
      <Divider flexItem>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          {section.name === "catalogues" ? (
            <Button variant="outlined" onClick={onProjectMenuClick}>
              <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                {selectedProject ? selectedProject.name : "All Projects"}
                {selectedProject ? (
                  <img
                    src={selectedProject.thumbnail}
                    alt={selectedProject.name}
                    style={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                ) : (
                  <AddIcon />
                )}
              </Stack>
            </Button>
          ) : null}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onOpen(section)}
          >
            Add {section.title}
          </Button>
        </Stack>
      </Divider>

      <Stack
        sx={{
          width: "100%",
          minHeight: 250,
          p: 2,
          "& .swiper-button-prev, & .swiper-button-next": {
            color: "primary.main",
          },
          "& .swiper-pagination-bullet": {
            bgcolor: "grey.600",
            opacity: 1,
            width: 8,
            height: 8,
          },
          "& .swiper-pagination-bullet-active": {
            bgcolor: "primary.main",
            width: 12,
            height: 12,
          },
        }}
      >
        {loading ? (
          <Stack sx={{ width: "100%", alignItems: "center", py: 3 }}>
            <CircularProgress size={24} />
          </Stack>
        ) : items.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center" }}>
            No selected items for homepage yet.
          </Typography>
        ) : (
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation={true}
            slidesPerView={3}
            style={{ width: "100%", height: "100%" }}
          >
            {items.map((item) => (
              <SwiperSlide key={item._id}>
                <Stack sx={{ alignItems: "center", gap: 1 }}>
                  {section.header ? (
                    <img
                      src={String(item[section.header] ?? "")}
                      style={{
                        width: 220,
                        height: 130,
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{
                        border: (theme) =>
                          `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        width: 220,
                        height: 130,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 6,
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.text || "No text"}{" "}
                    </Typography>
                  )}
                  <Stack
                    direction="row"
                    sx={{
                      width: 220,
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Stack direction={"row"} sx={{ gap: 1, alignItems: "baseline" }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          width: 120,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {String(item[section.text || "title"] || item._id)}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Order:{" "}
                        {typeof item.homepageOrder === "number"
                          ? item.homepageOrder
                          : "-"}
                      </Typography>
                    </Stack>
                    <Stack>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(section.name, item._id)}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Stack>
    </Stack>
  );
};

export default SectionPreview;
