'use client'

import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  fetchMainPageLayoutItems,
  updateMainPageLayoutItem,
} from "../services/mainPageLayoutApi";
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

const sections = [
  { name: "banner", title: "Banner", header: "poster", text: "name" },
  {
    name: "projects",
    title: "Subscribtion",
    header: "thumbnail",
    text: "title",
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
    setSelectedItemIds(sortHomepageItems(sectionData).map((item) => item._id));
    setSaveErrorMsg("");
  };

  const handleDelete = async (sectionName: string, itemId: string) => {
    setSaveErrorMsg("");

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

    const currentSectionItems = sectionItems[sectionName] || [];
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

  useEffect(() => {
    const controller = new AbortController();

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

    fetchAllSections();

    return () => controller.abort("Main page layout unmounted");
  }, []);

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
      const currentSectionItems = sectionItems[sectionName] || [];
      const updatesToSend = currentSectionItems
        .filter((item) => {
          const selectedIndex = selectedItemIds.indexOf(item._id);
          if (selectedIndex === -1) {
            return false;
          }

          const nextOrder = selectedIndex + 1;
          return (
            !Boolean(item.showInHomepage) ||
            (item.homepageOrder ?? null) !== nextOrder
          );
        })
        .map((item) => ({
          _id: item._id,
          showInHomepage: true,
          homepageOrder: selectedItemIds.indexOf(item._id) + 1,
        }));

      if (updatesToSend.length > 0) {
        const results = await Promise.all(
          updatesToSend.map((item) =>
            updateMainPageLayoutItem(sectionName, item._id, {
              showInHomepage: item.showInHomepage,
              homepageOrder: item.homepageOrder,
            })
          )
        );

        const failedResult = results.find((result) => !result.ok);
        if (failedResult) {
          setSaveErrorMsg(failedResult.message || "Failed to save selection.");
          return;
        }
      }

      const refreshedResult = await fetchSectionData(sectionName);
      if (!refreshedResult.ok) {
        setSaveErrorMsg(
          refreshedResult.message || "Failed to refresh section."
        );
        return;
      }

      handleClose();
    } catch (error) {
      setSaveErrorMsg(
        error instanceof Error ? error.message : "Failed to save item."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const modalItems = openedSection
    ? sectionItems[openedSection.name] || []
    : [];

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
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleOpen(section)}
              >
                Add {section.title}
              </Button>
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
                  const sectionPreviewData = sortHomepageItems(
                    sectionItems[section.name] || []
                  );
                  console.log(sectionPreviewData);
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
                                  p: 0.1,
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
          <Typography variant="h6">Add {openedSection?.title}</Typography>
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
    </Stack>
  );
};

export default MainPageLayout;
