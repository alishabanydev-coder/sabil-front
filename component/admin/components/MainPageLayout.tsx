"use client";

import {
  alpha,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { useAdminMainPageLayout } from "../hooks/useAdminMainPageLayout";
import { Swiper, SwiperSlide } from "swiper/react";
import AddIcon from "@mui/icons-material/Add";
import { Navigation, Pagination } from "swiper/modules";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "80vh",
  width: "80%",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  gap: 2,
};

const MainPageLayout = () => {
  const {
    errorMsg,
    getSectionPreviewItems,
    handleClose,
    handleDelete,
    handleOpen,
    handleProjectMenuClick,
    handleProjectMenuClose,
    handleProjectSelect,
    handleSave,
    isSaving,
    loading,
    menuElRef,
    modalItems,
    open,
    openedSection,
    openProjectMenu,
    projects,
    saveErrorMsg,
    sections,
    selectedItemIds,
    selectedProject,
    toggleItemSelection,
  } = useAdminMainPageLayout();

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        border: (theme) => `1px solid ${theme.palette.primary.main}`,
        borderRadius: 2,
        pt: 1,
      }}
    >
      <Stack sx={{ width: "100%", height: "100%", overflowY: "auto", gap: 2 }}>
        {sections.map((section) => {
          const sectionPreviewData = getSectionPreviewItems(section.name);

          return (
            <Stack key={section.name}>
              <Divider flexItem>
                <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                  {section.name === "catalogues" ? (
                    <Button variant="outlined" onClick={handleProjectMenuClick}>
                      <Stack
                        direction="row"
                        sx={{ gap: 1, alignItems: "center" }}
                      >
                        {selectedProject
                          ? selectedProject.name
                          : "All Projects"}
                        {selectedProject ? (
                          <img
                            src={selectedProject.thumbnail}
                            alt={selectedProject.name}
                            style={{
                              width: 24,
                              height: 24,
                              objectFit: "contain",
                            }}
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
                    onClick={() => handleOpen(section)}
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
                ) : sectionPreviewData.length === 0 ? (
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
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
                    {sectionPreviewData.map((item) => (
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
                            <Stack
                              direction={"row"}
                              sx={{ gap: 1, alignItems: "baseline" }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  width: 120,
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {String(
                                  item[section.text || "title"] || item._id
                                )}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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
                                onClick={() =>
                                  handleDelete(section.name, item._id)
                                }
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
        })}
      </Stack>

      <Modal open={open} onClose={handleClose}>
        <Stack sx={style}>
          <Stack direction="row" sx={{ alignItems: "baseline", gap: 2 }}>
            <Typography variant="h6">Add {openedSection?.title}</Typography>
            {openedSection?.title === "Catalogues" ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleProjectMenuClick}
              >
                {selectedProject ? selectedProject.name : "Select Project"}
              </Button>
            ) : null}

            <Menu
              anchorEl={menuElRef.current}
              open={openProjectMenu}
              onClose={handleProjectMenuClose}
            >
              {projects.map((project) => (
                <MenuItem
                  key={project._id}
                  value={project._id}
                  selected={selectedProject?._id === project._id}
                  onClick={() => handleProjectSelect(project)}
                  sx={{
                    mx: 0.5,
                    mb: 0.5,
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.2),
                    },
                    "&.Mui-selected": {
                      border: (theme) =>
                        `1px solid ${theme.palette.primary.main}`,
                    },
                  }}
                >
                  <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      style={{ width: 20, height: 20, objectFit: "contain" }}
                    />
                    {project.name}
                  </Stack>
                </MenuItem>
              ))}
            </Menu>
          </Stack>
          {loading ? (
            <Stack sx={{ width: "100%", alignItems: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : errorMsg ? (
            <Typography color="error">{errorMsg}</Typography>
          ) : (
            <Stack sx={{ width: "100%", gap: 2 }}>
              <Stack
                direction={"row"}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  width: "100%",
                  height: 400,
                  overflowY: "auto",
                  gap: 1,
                  p: 1,
                  flexWrap: "wrap",
                }}
              >
                {modalItems.map((item) => {
                  const isUnpublished =
                    openedSection?.name === "video" &&
                    item.isPublished === false;
                  const isSelected =
                    !isUnpublished && selectedItemIds.includes(item._id);
                  const selectedOrder = isSelected
                    ? selectedItemIds.indexOf(item._id) + 1
                    : null;
                  return (
                    <Stack
                      key={item._id}
                      onClick={() => {
                        if (!isUnpublished) {
                          toggleItemSelection(item._id);
                        }
                      }}
                      sx={{
                        position: "relative",
                        width: 250,
                        height: 180,
                        p: 1,
                        border: (theme) =>
                          `1px solid ${
                            isSelected
                              ? theme.palette.primary.main
                              : theme.palette.divider
                          }`,
                        borderRadius: 1,
                        cursor: isUnpublished ? "not-allowed" : "pointer",
                        bgcolor: isSelected ? "action.selected" : "transparent",
                        filter: isUnpublished ? "grayscale(100%)" : "none",
                        opacity: isUnpublished ? 0.55 : 1,
                        overflow: "hidden",
                      }}
                    >
                      {openedSection?.header ? (
                        <img
                          src={String(item[openedSection.header] ?? "")}
                          style={{
                            width: "100%",
                            aspectRatio: "16 / 9",
                            objectFit: "contain",
                            borderRadius: 8,
                            filter: isUnpublished ? "blur(1px)" : "none",
                          }}
                        />
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          {item.text || "No text"}
                        </Typography>
                      )}
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: "start",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => toggleItemSelection(item._id)}
                          disabled={isSaving || isUnpublished}
                        />
                        <Typography
                          sx={{
                            fontWeight: 600,
                            width: 120,
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {String(
                            item[openedSection?.text || "title"] || item._id
                          )}
                        </Typography>
                        {selectedOrder ? (
                          <Typography
                            variant="caption"
                            sx={{ color: "primary.main", fontWeight: 700 }}
                          >
                            #{selectedOrder}
                          </Typography>
                        ) : null}
                      </Stack>
                      {isUnpublished ? (
                        <Stack
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            pointerEvents: "none",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontWeight: 700,
                            }}
                          >
                            Hidden from public
                          </Typography>
                        </Stack>
                      ) : null}
                    </Stack>
                  );
                })}
              </Stack>

              <Stack direction="row" sx={{ width: "100%", gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                {saveErrorMsg ? (
                  <Typography color="error" variant="body2">
                    {saveErrorMsg}
                  </Typography>
                ) : null}

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Modal>
      
      <Menu
        anchorEl={menuElRef.current}
        open={openProjectMenu}
        onClose={handleProjectMenuClose}
      >
        <MenuItem
          value={null}
          selected={selectedProject?._id === null}
          onClick={() => handleProjectSelect(null)}
          sx={{
            mx: 0.5,
            mb: 0.5,
            borderRadius: 2,
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
            },
            "&.Mui-selected": {
              border: (theme) => `1px solid ${theme.palette.primary.main}`,
            },
          }}
        >
          <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
            All Projects
          </Stack>
        </MenuItem>
        {projects.map((project) => (
          <MenuItem
            key={project._id}
            value={project._id}
            selected={selectedProject?._id === project._id}
            onClick={() => handleProjectSelect(project)}
            sx={{
              mx: 0.5,
              mb: 0.5,
              borderRadius: 2,
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
              },
              "&.Mui-selected": {
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
              },
            }}
          >
            <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
              <img
                src={project.thumbnail}
                alt={project.name}
                style={{ width: 20, height: 20, objectFit: "contain" }}
              />
              {project.name}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default MainPageLayout;
