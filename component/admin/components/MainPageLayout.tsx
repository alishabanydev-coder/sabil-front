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
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import AddIcon from "@mui/icons-material/Add";
import {
  fetchMainPageLayoutItems,
  updateMainPageLayoutSection,
  updateMainPageLayoutItem,
} from "../services/mainPageLayoutApi";
import { Navigation, Pagination } from "swiper/modules";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { fetchProjects } from "../services/projectsApi";

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

const sections = [
  { name: "banner", title: "Banner", header: "poster", text: "name" },
  {
    name: "projects",
    title: "Subscribtion",
    header: "thumbnail",
    text: "title",
  },
  {
    name: "catalogues",
    title: "Catalogues",
    header: "image",
    text: "header",
  },
  {
    name: "breakdown",
    title: "Project Breakdowns",
    header: "thumbnail",
    text: "title",
  },
  { name: "video", title: "Watch Us", header: "thumbnail", text: "title" },
  { name: "comment", title: "People Opinion", header: "", text: "username" },
  { name: "blog", title: "Blog", header: "images", text: "title" },
];

type Section = {
  name: string;
  title: string;
  header: string;
  text: string;
};

type LayoutItem = {
  _id: string;
  showInHomepage?: boolean;
  homepageOrder?: number | null;
  [key: string]: any;
};

type ProjectRecord = {
  _id?: string;
  id?: string;
  name?: string;
  thumbnail?: string;
  description?: string;
};

const MainPageLayout = () => {
  const [open, setOpen] = useState(false);
  const [openedSection, setOpenedSection] = useState<Section | null>(null);
  const [sectionItems, setSectionItems] = useState<
    Record<string, LayoutItem[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMsg, setSaveErrorMsg] = useState("");
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [projectId, setProjectId] = useState("");
  const [openProjectMenu, setOpenProjectMenu] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(
    null
  );

  const menuElRef = useRef<HTMLButtonElement>(null);

  const handleProjectMenuClose = () => {
    setOpenProjectMenu(false);
  };

  const handleProjectMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setOpenProjectMenu(true);
    menuElRef.current = event.currentTarget;
  };

  const handleProjectSelect = (project: ProjectRecord | null) => {
    setSelectedProject(project);
    setProjectId(project?._id ?? "");
    if (openedSection?.name === "catalogues") {
      const catalogueItems = sectionItems.catalogues || [];
      const selectedIds = sortHomepageItems(
        catalogueItems.filter((item) => item.projectId === project?._id)
      ).map((item) => item._id);
      setSelectedItemIds(selectedIds);
    }
    handleProjectMenuClose();
  };

  const sortHomepageItems = (items: LayoutItem[]) =>
    items
      .filter((item) => Boolean(item.showInHomepage))
      .sort((firstItem, secondItem) => {
        const firstOrder =
          typeof firstItem.homepageOrder === "number"
            ? firstItem.homepageOrder
            : Number.MAX_SAFE_INTEGER;
        const secondOrder =
          typeof secondItem.homepageOrder === "number"
            ? secondItem.homepageOrder
            : Number.MAX_SAFE_INTEGER;
        return firstOrder - secondOrder;
      });

  const fetchSectionData = async (
    sectionName: string,
    signal?: AbortSignal
  ) => {
    const result = await fetchMainPageLayoutItems(sectionName, { signal });

    if (!result.ok) {
      return {
        ok: false as const,
        message: result.message,
      };
    }

    setSectionItems((current) => ({
      ...current,
      [sectionName]: result.items,
    }));

    return {
      ok: true as const,
      items: result.items,
    };
  };

  const handleClose = () => {
    const activeSection = openedSection;
    setOpen(false);
    setOpenedSection(null);
    setSelectedItemIds([]);
    setSaveErrorMsg("");

    if (activeSection) {
      void fetchSectionData(activeSection.name);
    }
  };

  const handleOpen = (section: Section) => {
    setOpen(true);
    setOpenedSection(section);
    const sectionData = sectionItems[section.name] || [];
    if (section.name === "catalogues" && selectedProject?._id) {
      setSelectedItemIds(
        sortHomepageItems(
          sectionData.filter((item) => item.projectId === selectedProject._id)
        ).map((item) => item._id)
      );
    } else {
      setSelectedItemIds(
        sortHomepageItems(sectionData).map((item) => item._id)
      );
    }
    setSaveErrorMsg("");
  };

  const handleDelete = async (sectionName: string, itemId: string) => {
    setSaveErrorMsg("");

    const currentSectionItems = sectionItems[sectionName] || [];
    const deletedItem = currentSectionItems.find((item) => item._id === itemId);
    if (!deletedItem) {
      setSaveErrorMsg("Item not found.");
      return;
    }

    const removeResult = await updateMainPageLayoutItem(sectionName, itemId, {
      showInHomepage: false,
      homepageOrder: null,
    });

    if (!removeResult.ok) {
      setSaveErrorMsg(
        removeResult.message || "Failed to remove item from homepage."
      );
      return;
    }

    if (sectionName === "catalogues") {
      const projectScopedSelectedIds = sortHomepageItems(
        currentSectionItems.filter(
          (item) =>
            item._id !== itemId &&
            item.projectId === deletedItem.projectId &&
            item.showInHomepage
        )
      ).map((item) => item._id);

      const reorderResult = await updateMainPageLayoutSection(
        sectionName,
        projectScopedSelectedIds,
        {
          projectId: deletedItem.projectId,
        }
      );
      if (!reorderResult.ok) {
        setSaveErrorMsg(
          reorderResult.message || "Failed to reorder catalogue items."
        );
        return;
      }

      setSectionItems((current) => ({
        ...current,
        [sectionName]: reorderResult.items,
      }));
      setSelectedItemIds((currentIds) =>
        currentIds.filter((id) => id !== itemId)
      );
      return;
    }

    const sectionAfterRemoval = currentSectionItems.map((item) =>
      item._id === itemId
        ? {
            ...item,
            showInHomepage: false,
            homepageOrder: null,
          }
        : item
    );

    const remainingHomepageItems = sortHomepageItems(sectionAfterRemoval);
    const reorderPayload = remainingHomepageItems
      .map((item, index) => ({
        _id: item._id,
        homepageOrder: index + 1,
        needsUpdate: (item.homepageOrder ?? null) !== index + 1,
      }))
      .filter((item) => item.needsUpdate);

    if (reorderPayload.length > 0) {
      const reorderResults = await Promise.all(
        reorderPayload.map((item) =>
          updateMainPageLayoutItem(sectionName, item._id, {
            homepageOrder: item.homepageOrder,
          })
        )
      );

      const failedReorder = reorderResults.find((result) => !result.ok);
      if (failedReorder) {
        setSaveErrorMsg(
          failedReorder.message || "Failed to reorder homepage items."
        );
        return;
      }
    }

    setSectionItems((currentItems) => ({
      ...currentItems,
      [sectionName]: sectionAfterRemoval.map((item) =>
        item._id === itemId
          ? {
              ...item,
              showInHomepage: false,
              homepageOrder: null,
            }
          : {
              ...item,
              ...(item.showInHomepage
                ? {
                    homepageOrder:
                      remainingHomepageItems.findIndex(
                        (homepageItem) => homepageItem._id === item._id
                      ) + 1,
                  }
                : {}),
            }
      ),
    }));

    setSelectedItemIds((currentIds) =>
      currentIds.filter((id) => id !== itemId)
    );
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItemIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((id) => id !== itemId)
        : [...currentIds, itemId]
    );
  };

  const handleSave = async () => {
    if (!openedSection) {
      return;
    }

    setIsSaving(true);
    setSaveErrorMsg("");

    try {
      const sectionName = openedSection.name;
      if (sectionName === "catalogues" && !selectedProject?._id) {
        setSaveErrorMsg("Select a project to manage catalogue order.");
        return;
      }
      const saveResult = await updateMainPageLayoutSection(
        sectionName,
        selectedItemIds,
        sectionName === "catalogues" ? { projectId: selectedProject?._id } : {}
      );

      if (!saveResult.ok) {
        setSaveErrorMsg(saveResult.message || "Failed to save selection.");
        return;
      }

      setSectionItems((current) => ({
        ...current,
        [sectionName]: saveResult.items,
      }));

      handleClose();
    } catch (error) {
      setSaveErrorMsg(
        error instanceof Error ? error.message : "Failed to save item."
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await fetchProjects({ signal: controller.signal });

        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);

        if (!result.ok) {
          setErrorMsg(result.message);
          return;
        }

        setProjects(result.projects);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load Projects."
        );
      }
    }

    async function fetchAllSections() {
      try {
        setLoading(true);
        setErrorMsg("");

        const results = await Promise.all(
          sections.map((section) =>
            fetchMainPageLayoutItems(section.name, {
              signal: controller.signal,
            })
          )
        );

        if (controller.signal.aborted) {
          return;
        }

        const failedResult = results.find((result) => !result.ok);
        if (failedResult) {
          setErrorMsg(failedResult.message || "Failed to load section data.");
          return;
        }

        const nextItems: Record<string, LayoutItem[]> = {};
        sections.forEach((section, index) => {
          nextItems[section.name] = results[index].ok
            ? results[index].items
            : [];
        });
        setSectionItems(nextItems);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error
            ? error.message
            : "Failed to load main page layout data."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProjects();
    fetchAllSections();

    return () => controller.abort("Main page layout unmounted");
  }, []);

  let modalItems: LayoutItem[] = [];

  if (openedSection?.name === "catalogues") {
    const catalogueItems = sectionItems[openedSection.name] || [];
    modalItems = selectedProject?._id
      ? catalogueItems.filter((item) => item.projectId === selectedProject._id)
      : catalogueItems;
  } else {
    modalItems = openedSection ? sectionItems[openedSection.name] || [] : [];
  }

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
        {sections.map((section) => (
          <Stack key={section.name}>
            <Divider flexItem key={section.name}>
              <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                {section.name === "catalogues" ? (
                  <Button variant="outlined" onClick={handleProjectMenuClick}>
                    <Stack
                      direction="row"
                      sx={{ gap: 1, alignItems: "center" }}
                    >
                      {selectedProject ? selectedProject.name : "All Projects"}
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
              ) : (
                (() => {
                  let sectionPreviewData = sortHomepageItems(
                    sectionItems[section.name] || []
                  );
                  if (section.name === "catalogues" && selectedProject?._id) {
                    sectionPreviewData = sectionPreviewData.filter(
                      (item) => item.projectId === selectedProject?._id
                    );
                  }
                  if (sectionPreviewData.length === 0) {
                    return (
                      <Typography
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                      >
                        No selected items for homepage yet.
                      </Typography>
                    );
                  }

                  return (
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
                                src={item[section.header]}
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
                                  {item[section.text || "title"] || item._id}
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
                  );
                })()
              )}
            </Stack>
          </Stack>
        ))}
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
                  const isSelected = selectedItemIds.includes(item._id);
                  const selectedOrder = isSelected
                    ? selectedItemIds.indexOf(item._id) + 1
                    : null;
                  return (
                    <Stack
                      key={item._id}
                      onClick={() => toggleItemSelection(item._id)}
                      sx={{
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
                        cursor: "pointer",
                        bgcolor: isSelected ? "action.selected" : "transparent",
                      }}
                    >
                      {openedSection?.header ? (
                        <img
                          src={item[openedSection.header]}
                          style={{
                            width: "100%",
                            aspectRatio: "16 / 9",
                            objectFit: "contain",
                            borderRadius: 8,
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
                          {item[openedSection?.text || "title"] || item._id}
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
