import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { secondaryModalSlotProps } from "./secondaryModalBackdrop";
import ImageSlider from "@/component/donation/component/ImageSlider";
import { fetchBlogs, createBlog, updateBlog } from "../../services/blogApi";
import {
  fetchBreakdowns,
  createBreakdown,
  updateBreakdown,
} from "../../services/breakdownApi";
import type { UpdateDraft } from "./donationDrafts";

type UpdateRefType = UpdateDraft["refType"];
type FormMode = "existing" | "new";

type FormImage = {
  url: string;
  file?: File;
};

type BlogRecord = {
  _id: string;
  title: string;
  subHeader?: string;
  content: string;
  image?: string[];
  videoUrl?: string;
  createdAt?: string;
};

type BreakdownRecord = {
  _id: string;
  title: string;
  content: string;
  thumbnail?: string;
  videoUrl?: string;
  createdAt?: string;
};

const UPDATE_CONTENT_MAX_HEIGHT = 120;

const isMongoId = (value: string) => /^[a-f\d]{24}$/i.test(value);

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `update-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const reindex = (updates: UpdateDraft[]) =>
  updates.map((update, index) => ({ ...update, order: index }));

const formatUpdateDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString().slice(0, 10);
};

const buildUpdateFromBlog = (
  blog: BlogRecord,
  order: number,
  localId?: string
): UpdateDraft => ({
  id: localId ?? createId(),
  refType: "Blog",
  refId: blog._id,
  source: "existing",
  title: blog.title,
  subHeader: blog.subHeader ?? "",
  content: blog.content,
  images: blog.image ?? [],
  videoUrl: blog.videoUrl ?? "",
  authorName: "Sabeel Media Cast",
  authorAvatar: "/avatar1.webp",
  createdAt: blog.createdAt ?? new Date().toISOString(),
  order,
});

const buildUpdateFromBreakdown = (
  breakdown: BreakdownRecord,
  order: number,
  localId?: string
): UpdateDraft => ({
  id: localId ?? createId(),
  refType: "BreakDown",
  refId: breakdown._id,
  source: "existing",
  title: breakdown.title,
  subHeader: "",
  content: breakdown.content,
  images: breakdown.thumbnail ? [breakdown.thumbnail] : [],
  videoUrl: breakdown.videoUrl ?? "",
  authorName: "Sabeel Media Cast",
  authorAvatar: "/avatar1.webp",
  createdAt: breakdown.createdAt ?? new Date().toISOString(),
  order,
});

const AddUpdate = ({
  open,
  onClose,
  updates,
  onUpdatesChange,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  updates: UpdateDraft[];
  onUpdatesChange: (updates: UpdateDraft[]) => void;
  projectId: string;
}) => {
  const [localUpdates, setLocalUpdates] = useState<UpdateDraft[]>(updates);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>("existing");
  const [refType, setRefType] = useState<UpdateRefType>("Blog");
  const [selectedExistingId, setSelectedExistingId] = useState("");
  const [title, setTitle] = useState("");
  const [subHeader, setSubHeader] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<FormImage[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [breakdowns, setBreakdowns] = useState<BreakdownRecord[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [existingError, setExistingError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const editingUpdate =
    localUpdates.find((update) => update.id === editingId) ?? null;
  const isEditing = editingId !== null;
  const isExistingForm = isEditing
    ? editingUpdate?.source === "existing"
    : formMode === "existing";
  const isValid = isExistingForm
    ? selectedExistingId.length > 0
    : title.trim().length > 0;

  const linkedRefKeys = new Set(
    localUpdates
      .filter(
        (update) =>
          update.source === "existing" &&
          update.id !== editingId &&
          update.refId
      )
      .map((update) => `${update.refType}:${update.refId}`)
  );

  const availableBlogs = blogs.filter(
    (blog) =>
      !linkedRefKeys.has(`Blog:${blog._id}`) ||
      (editingUpdate?.refType === "Blog" && editingUpdate.refId === blog._id)
  );

  const availableBreakdowns = breakdowns.filter(
    (breakdown) =>
      !linkedRefKeys.has(`BreakDown:${breakdown._id}`) ||
      (editingUpdate?.refType === "BreakDown" &&
        editingUpdate.refId === breakdown._id)
  );

  const existingOptions =
    refType === "Blog" ? availableBlogs : availableBreakdowns;

  const selectedExistingBlog =
    refType === "Blog"
      ? blogs.find((blog) => blog._id === selectedExistingId)
      : undefined;

  const selectedExistingBreakdown =
    refType === "BreakDown"
      ? breakdowns.find((breakdown) => breakdown._id === selectedExistingId)
      : undefined;

  useEffect(() => {
    if (open) {
      setLocalUpdates(updates);
    }
  }, [open, updates]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();

    const loadExisting = async () => {
      setLoadingExisting(true);
      setExistingError("");

      try {
        const [blogResult, breakdownResult] = await Promise.all([
          fetchBlogs({ signal: controller.signal }),
          fetchBreakdowns({ signal: controller.signal }),
        ]);

        if (blogResult.ok) {
          setBlogs(blogResult.blogs);
        } else {
          setExistingError(blogResult.message || "Failed to load blogs.");
        }

        if (breakdownResult.ok) {
          setBreakdowns(breakdownResult.breakdowns);
        } else if (!breakdownResult.ok) {
          setExistingError((current) =>
            current
              ? `${current} ${breakdownResult.message}`
              : breakdownResult.message || "Failed to load breakdowns."
          );
        }
      } catch {
        if (!controller.signal.aborted) {
          setExistingError("Failed to load existing blogs and breakdowns.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingExisting(false);
        }
      }
    };

    void loadExisting();

    return () => controller.abort();
  }, [open]);

  useEffect(() => {
    if (showForm && editingId) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showForm, editingId]);

  useEffect(() => {
    if (!isExistingForm) {
      return;
    }

    const options = refType === "Blog" ? availableBlogs : availableBreakdowns;
    const isCurrentSelectionValid = options.some(
      (option) => option._id === selectedExistingId
    );

    if (!isCurrentSelectionValid) {
      setSelectedExistingId(options[0]?._id ?? "");
    }
  }, [
    isExistingForm,
    refType,
    availableBlogs,
    availableBreakdowns,
    selectedExistingId,
  ]);

  const resetForm = () => {
    setEditingId(null);
    setFormMode("existing");
    setRefType("Blog");
    setSelectedExistingId("");
    setTitle("");
    setSubHeader("");
    setContent("");
    setImages([]);
    setVideoUrl("");
    setSubmitError("");
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const urls = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...urls]);
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleStartEdit = (update: UpdateDraft) => {
    setEditingId(update.id);
    setSubmitError("");

    if (update.source === "existing") {
      setFormMode("existing");
      setRefType(update.refType);
      setSelectedExistingId(update.refId);
    } else {
      setFormMode("new");
      setRefType(update.refType);
      setTitle(update.title);
      setSubHeader(update.subHeader);
      setContent(update.content);
      setImages(update.images.map((url) => ({ url })));
      setVideoUrl(update.videoUrl);
    }

    setShowForm(true);
  };

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmittingForm) {
      return;
    }

    setSubmitError("");
    setIsSubmittingForm(true);

    try {
      if (isExistingForm) {
        const duplicate = localUpdates.some(
          (update) =>
            update.refType === refType &&
            update.refId === selectedExistingId &&
            update.id !== editingId
        );

        if (duplicate) {
          setSubmitError(
            "This blog or breakdown is already linked to the project."
          );
          return;
        }

        if (refType === "Blog") {
          const blog = blogs.find((item) => item._id === selectedExistingId);
          if (!blog) {
            setSubmitError("Selected blog was not found.");
            return;
          }

          if (editingId) {
            setLocalUpdates((prev) =>
              prev.map((update) =>
                update.id === editingId
                  ? buildUpdateFromBlog(blog, update.order, update.id)
                  : update
              )
            );
          } else {
            setLocalUpdates((prev) => [
              ...prev,
              buildUpdateFromBlog(blog, prev.length),
            ]);
          }
        } else {
          const breakdown = breakdowns.find(
            (item) => item._id === selectedExistingId
          );
          if (!breakdown) {
            setSubmitError("Selected breakdown was not found.");
            return;
          }

          if (editingId) {
            setLocalUpdates((prev) =>
              prev.map((update) =>
                update.id === editingId
                  ? buildUpdateFromBreakdown(breakdown, update.order, update.id)
                  : update
              )
            );
          } else {
            setLocalUpdates((prev) => [
              ...prev,
              buildUpdateFromBreakdown(breakdown, prev.length),
            ]);
          }
        }
      } else {
        const imageFiles = images
          .map((image) => image.file)
          .filter((file): file is File => file instanceof File);

        if (refType === "BreakDown" && !projectId) {
          setSubmitError(
            "Select a channel project in the donation form before creating a breakdown."
          );
          return;
        }

        if (refType === "BreakDown" && imageFiles.length === 0) {
          setSubmitError("Breakdown thumbnail image is required.");
          return;
        }

        if (!content.trim()) {
          setSubmitError("Content is required.");
          return;
        }

        if (refType === "Blog") {
          const editingUpdateItem = editingId
            ? localUpdates.find((update) => update.id === editingId)
            : null;

          if (editingUpdateItem && isMongoId(editingUpdateItem.refId)) {
            const result = await updateBlog(editingUpdateItem.refId, {
              title: title.trim(),
              subHeader: subHeader.trim(),
              content: content.trim(),
              videoUrl: videoUrl.trim(),
              images: imageFiles,
              keepImages: editingUpdateItem.images,
            });

            if (!result.ok || !result.blog) {
              setSubmitError(result.message || "Failed to update blog.");
              return;
            }

            setLocalUpdates((prev) =>
              prev.map((update) =>
                update.id === editingId
                  ? buildUpdateFromBlog(result.blog, update.order, update.id)
                  : update
              )
            );
          } else {
            const result = await createBlog({
              title: title.trim(),
              subHeader: subHeader.trim(),
              content: content.trim(),
              videoUrl: videoUrl.trim(),
              images: imageFiles,
            });

            if (!result.ok || !result.blog) {
              setSubmitError(result.message || "Failed to create blog.");
              return;
            }

            if (editingId) {
              setLocalUpdates((prev) =>
                prev.map((update) =>
                  update.id === editingId
                    ? buildUpdateFromBlog(result.blog, update.order, update.id)
                    : update
                )
              );
            } else {
              setLocalUpdates((prev) => [
                ...prev,
                buildUpdateFromBlog(result.blog, prev.length),
              ]);
            }
          }
        } else {
          const editingUpdateItem = editingId
            ? localUpdates.find((update) => update.id === editingId)
            : null;

          if (editingUpdateItem && isMongoId(editingUpdateItem.refId)) {
            const result = await updateBreakdown(editingUpdateItem.refId, {
              projectId,
              title: title.trim(),
              content: content.trim(),
              videoUrl: videoUrl.trim(),
              thumbnail: imageFiles[0],
            });

            if (!result.ok || !result.breakdown) {
              setSubmitError(result.message || "Failed to update breakdown.");
              return;
            }

            setLocalUpdates((prev) =>
              prev.map((update) =>
                update.id === editingId
                  ? buildUpdateFromBreakdown(
                      result.breakdown,
                      update.order,
                      update.id
                    )
                  : update
              )
            );
          } else {
            const result = await createBreakdown({
              projectId,
              title: title.trim(),
              content: content.trim(),
              videoUrl: videoUrl.trim(),
              thumbnail: imageFiles[0],
            });

            if (!result.ok || !result.breakdown) {
              setSubmitError(result.message || "Failed to create breakdown.");
              return;
            }

            if (editingId) {
              setLocalUpdates((prev) =>
                prev.map((update) =>
                  update.id === editingId
                    ? buildUpdateFromBreakdown(
                        result.breakdown,
                        update.order,
                        update.id
                      )
                    : update
                )
              );
            } else {
              setLocalUpdates((prev) => [
                ...prev,
                buildUpdateFromBreakdown(result.breakdown, prev.length),
              ]);
            }
          }
        }
      }

      resetForm();
      setShowForm(false);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleRemove = (id: string) => {
    setLocalUpdates((prev) => reindex(prev.filter((update) => update.id !== id)));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    setLocalUpdates((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) {
        return prev;
      }

      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return reindex(next);
    });
  };

  const handleSave = () => {
    onUpdatesChange(localUpdates);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} slotProps={secondaryModalSlotProps}>
      <Stack
        sx={{
          direction: "ltr",
          width: 500,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          overflow: "auto",
          maxHeight: "94vh",
          p: 2,
          gap: 1,
        }}
      >
        <Stack sx={{ gap: 1, height: "auto", overflow: "auto", py: 1 }}>
          <Typography variant="h6">Updates</Typography>
          <Divider flexItem />

          {localUpdates.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 1 }}>
              No updates yet. Add a blog or breakdown below.
            </Typography>
          ) : (
            localUpdates.map((update, index) => (
              <Stack
                key={update.id}
                sx={{
                  width: "100%",
                  gap: 1,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Stack
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Stack
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <IconButton
                      size="small"
                      aria-label="Move update up"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Move update down"
                      disabled={index === localUpdates.length - 1}
                      onClick={() => handleMove(index, 1)}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", ml: 0.5 }}
                    >
                      {`order: ${update.order}`}
                    </Typography>
                  </Stack>

                  <Stack
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      aria-label="Edit update"
                      onClick={() => handleStartEdit(update)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Remove update"
                      onClick={() => handleRemove(update.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>

                <Stack
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
                    <Chip
                      size="small"
                      color={update.refType === "Blog" ? "primary" : "secondary"}
                      label={update.refType === "Blog" ? "Blog" : "Breakdown"}
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      label={update.source === "existing" ? "Existing" : "New"}
                    />
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {formatUpdateDate(update.createdAt)}
                  </Typography>
                </Stack>

                {update.images.length > 0 ? (
                  <Stack sx={{ width: "100%" }}>
                    <ImageSlider
                      images={update.images}
                      title={update.title || update.id}
                    />
                  </Stack>
                ) : null}

                <Typography
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    fontFamily: "Namecat",
                    color: "primary.main",
                    letterSpacing: 1.5,
                    fontSize: { xs: 14, md: 18 },
                  }}
                >
                  {update.title}
                </Typography>

                {update.refType === "Blog" && update.subHeader.trim() ? (
                  <Typography
                    sx={{
                      fontSize: { xs: 12, md: 14 },
                      color: "text.secondary",
                      fontStyle: "italic",
                    }}
                  >
                    {update.subHeader}
                  </Typography>
                ) : null}

                {update.content.trim() ? (
                  <Typography
                    component="div"
                    sx={{
                      width: "100%",
                      maxHeight: UPDATE_CONTENT_MAX_HEIGHT,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: { xs: 5, md: 4 },
                      whiteSpace: "pre-line",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      fontSize: { xs: 12, md: 15 },
                      lineHeight: 1.6,
                      color: "text.primary",
                    }}
                  >
                    {update.content}
                  </Typography>
                ) : null}

                {update.videoUrl.trim() ? (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Video: {update.videoUrl}
                  </Typography>
                ) : null}
              </Stack>
            ))
          )}

          {showForm ? (
            <Stack
              ref={formRef}
              sx={{
                width: "100%",
                gap: 2,
                border: (theme) => `1px solid ${theme.palette.primary.light}`,
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "primary.main",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {isEditing
                  ? isExistingForm
                    ? "Edit linked update"
                    : "Edit update"
                  : formMode === "existing"
                    ? "Link existing update"
                    : "New update"}
              </Typography>

              {!isEditing ? (
                <FormControl fullWidth size="small">
                  <InputLabel id="update-form-mode-label">How to add</InputLabel>
                  <Select
                    labelId="update-form-mode-label"
                    id="update-form-mode"
                    value={formMode}
                    label="How to add"
                    onChange={(event) => {
                      setFormMode(event.target.value as FormMode);
                      setSubmitError("");
                      setSelectedExistingId("");
                    }}
                  >
                    <MenuItem value="existing">Select existing</MenuItem>
                    <MenuItem value="new">Create new</MenuItem>
                  </Select>
                </FormControl>
              ) : null}

              <FormControl fullWidth size="small">
                <InputLabel id="update-ref-type-label">Type</InputLabel>
                <Select
                  labelId="update-ref-type-label"
                  id="update-ref-type"
                  value={refType}
                  label="Type"
                  onChange={(event) => {
                    setRefType(event.target.value as UpdateRefType);
                    setSelectedExistingId("");
                    setSubmitError("");
                  }}
                >
                  <MenuItem value="Blog">Blog</MenuItem>
                  <MenuItem value="BreakDown">Breakdown</MenuItem>
                </Select>
              </FormControl>

              {isExistingForm ? (
                <Stack sx={{ gap: 1.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="update-existing-label">
                      {refType === "Blog" ? "Select blog" : "Select breakdown"}
                    </InputLabel>
                    <Select
                      labelId="update-existing-label"
                      id="update-existing"
                      value={selectedExistingId}
                      label={
                        refType === "Blog" ? "Select blog" : "Select breakdown"
                      }
                      onChange={(event) => {
                        setSelectedExistingId(event.target.value);
                        setSubmitError("");
                      }}
                      disabled={loadingExisting}
                    >
                      {loadingExisting ? (
                        <MenuItem value="" disabled>
                          Loading...
                        </MenuItem>
                      ) : existingOptions.length === 0 ? (
                        <MenuItem value="" disabled>
                          No {refType === "Blog" ? "blogs" : "breakdowns"}{" "}
                          available
                        </MenuItem>
                      ) : (
                        existingOptions.map((option) => (
                          <MenuItem key={option._id} value={option._id}>
                            {option.title}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>

                  {loadingExisting ? (
                    <Stack
                      sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                        color: "text.secondary",
                      }}
                    >
                      <CircularProgress size={18} />
                      <Typography variant="body2">
                        Loading existing {refType === "Blog" ? "blogs" : "breakdowns"}...
                      </Typography>
                    </Stack>
                  ) : null}

                  {existingError ? (
                    <Typography variant="body2" sx={{ color: "error.main" }}>
                      {existingError}
                    </Typography>
                  ) : null}

                  {selectedExistingBlog ? (
                    <Stack
                      sx={{
                        gap: 1,
                        p: 1.5,
                        borderRadius: 1,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {selectedExistingBlog.title}
                      </Typography>
                      {selectedExistingBlog.subHeader?.trim() ? (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", fontStyle: "italic" }}
                        >
                          {selectedExistingBlog.subHeader}
                        </Typography>
                      ) : null}
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {selectedExistingBlog.content}
                      </Typography>
                    </Stack>
                  ) : null}

                  {selectedExistingBreakdown ? (
                    <Stack
                      sx={{
                        gap: 1,
                        p: 1.5,
                        borderRadius: 1,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {selectedExistingBreakdown.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {selectedExistingBreakdown.content}
                      </Typography>
                    </Stack>
                  ) : null}
                </Stack>
              ) : (
                <>
                  <TextField
                    label="Title"
                    variant="standard"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    fullWidth
                  />

                  {refType === "Blog" ? (
                    <TextField
                      label="Sub header"
                      variant="standard"
                      value={subHeader}
                      onChange={(event) => setSubHeader(event.target.value)}
                      fullWidth
                    />
                  ) : null}

                  <TextField
                    label="Content"
                    variant="outlined"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    multiline
                    minRows={4}
                    fullWidth
                  />

                  <TextField
                    label="Video URL"
                    variant="standard"
                    value={videoUrl}
                    onChange={(event) => setVideoUrl(event.target.value)}
                    fullWidth
                  />

                  <Stack sx={{ gap: 1 }}>
                    {images.length > 0 ? (
                      <Stack sx={{ width: "100%", gap: 1 }}>
                        <ImageSlider
                          images={images.map((image) => image.url)}
                          title="Update images"
                        />
                        <Stack
                          sx={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {images.map((image, imageIndex) => (
                            <Stack
                              key={`${image.url}-${imageIndex}`}
                              sx={{
                                position: "relative",
                                width: 64,
                                height: 64,
                                borderRadius: 1,
                                overflow: "hidden",
                                border: (theme) =>
                                  `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              <Box
                                component="img"
                                src={image.url}
                                alt={`Selected ${imageIndex + 1}`}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <IconButton
                                size="small"
                                aria-label="Remove image"
                                onClick={() => handleRemoveImage(imageIndex)}
                                sx={{
                                  position: "absolute",
                                  top: 2,
                                  right: 2,
                                  bgcolor: "background.paper",
                                  boxShadow: 1,
                                  p: 0.25,
                                  "&:hover": { bgcolor: "grey.200" },
                                }}
                              >
                                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Stack>
                          ))}
                        </Stack>
                      </Stack>
                    ) : null}

                    <Button variant="contained" color="primary" component="label">
                      Add Image
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleImagesChange}
                      />
                    </Button>
                  </Stack>
                </>
              )}

              {submitError ? (
                <Typography variant="body2" sx={{ color: "error.main" }}>
                  {submitError}
                </Typography>
              ) : null}

              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button color="inherit" onClick={handleCancelForm}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!isValid || (isExistingForm && loadingExisting) || isSubmittingForm}
                  onClick={() => void handleSubmit()}
                >
                  {isSubmittingForm
                    ? "Saving..."
                    : isEditing
                      ? "Update"
                      : "Submit"}
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
            >
              Add Update
            </Button>
          )}
        </Stack>

        <Divider flexItem />
        <Stack
          sx={{
            direction: "ltr",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default AddUpdate;
