import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { secondaryModalSlotProps } from "./secondaryModalBackdrop";
import ImageSlider from "@/component/donation/component/ImageSlider";
import type { SectionDraft, SectionImageDraft } from "./donationDrafts";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `section-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const reindex = (sections: SectionDraft[]) =>
  sections.map((section, index) => ({ ...section, order: index }));

const getImageUrls = (images: SectionImageDraft[]) =>
  images.map((image) => image.url);

const AddSection = ({
  open,
  onClose,
  sections,
  onSectionsChange,
}: {
  open: boolean;
  onClose: () => void;
  sections: SectionDraft[];
  onSectionsChange: (sections: SectionDraft[]) => void;
}) => {
  const [localSections, setLocalSections] = useState<SectionDraft[]>(sections);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState<SectionImageDraft[]>([]);

  const formRef = useRef<HTMLDivElement>(null);

  const isValid = title.trim().length > 0;
  const isEditing = editingId !== null;

  useEffect(() => {
    if (open) {
      setLocalSections(sections);
    }
  }, [open, sections]);

  useEffect(() => {
    if (showForm && editingId) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showForm, editingId]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setText("");
    setImages([]);
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

  const handleStartEdit = (section: SectionDraft) => {
    setEditingId(section.id);
    setTitle(section.header);
    setText(section.text);
    setImages(section.images);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!isValid) {
      return;
    }

    if (editingId) {
      setLocalSections((prev) =>
        prev.map((section) =>
          section.id === editingId
            ? { ...section, header: title.trim(), text: text.trim(), images }
            : section
        )
      );
    } else {
      setLocalSections((prev) => [
        ...prev,
        {
          id: createId(),
          header: title.trim(),
          text: text.trim(),
          images,
          order: prev.length,
        },
      ]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    setLocalSections((prev) => reindex(prev.filter((section) => section.id !== id)));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    setLocalSections((prev) => {
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
    onSectionsChange(localSections);
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
          <Typography variant="h6">Sections</Typography>
          <Divider flexItem />

          {localSections.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 1 }}>
              No sections yet. Add one below.
            </Typography>
          ) : (
            localSections.map((section, index) => (
              <Stack
                key={section.id}
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
                      aria-label="Move section up"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Move section down"
                      disabled={index === localSections.length - 1}
                      onClick={() => handleMove(index, 1)}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", ml: 0.5 }}
                    >
                      {`order: ${section.order}`}
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
                      aria-label="Edit section"
                      onClick={() => handleStartEdit(section)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Remove section"
                      onClick={() => handleRemove(section.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>

                {section.images.length > 0 ? (
                  <Stack sx={{ width: "100%" }}>
                    <ImageSlider
                      images={getImageUrls(section.images)}
                      title={section.header || section.id}
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
                  {section.header}
                </Typography>

                {section.text.trim() ? (
                  <Typography
                    sx={{
                      fontSize: { xs: 12, md: 15 },
                      lineHeight: 1.6,
                      color: "text.primary",
                    }}
                  >
                    {section.text}
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
                sx={{ color: "primary.main", textAlign: "center", fontWeight: 700 }}
              >
                {isEditing ? "Edit section" : "New section"}
              </Typography>

              <TextField
                label="Title"
                variant="standard"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Text"
                variant="outlined"
                value={text}
                onChange={(event) => setText(event.target.value)}
                multiline
                minRows={3}
                fullWidth
              />

              <Stack sx={{ gap: 1 }}>
                {images.length > 0 ? (
                  <Stack sx={{ width: "100%", gap: 1 }}>
                    <ImageSlider images={getImageUrls(images)} title="Section images" />
                    <Stack
                      sx={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {images.map((image, index) => (
                        <Stack
                          key={`${image.url}-${index}`}
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
                            alt={`Selected ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            size="small"
                            aria-label="Remove image"
                            onClick={() => handleRemoveImage(index)}
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
                  disabled={!isValid}
                  onClick={handleSubmit}
                >
                  {isEditing ? "Update" : "Submit"}
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
              Add Section
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

export default AddSection;
