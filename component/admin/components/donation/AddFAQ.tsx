import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { secondaryModalSlotProps } from "./secondaryModalBackdrop";
import type { FaqDraft } from "./donationDrafts";

type FaqUiDraft = FaqDraft & { id: string };

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `faq-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const FAQ_SUMMARY_MAX_HEIGHT = 200;

const reindex = (faqs: FaqUiDraft[]) =>
  faqs.map((faq, index) => ({ ...faq, order: index }));

const AddFAQ = ({
  open,
  onClose,
  faqs,
  onFaqsChange,
}: {
  open: boolean;
  onClose: () => void;
  faqs: FaqDraft[];
  onFaqsChange: (faqs: FaqDraft[]) => void;
}) => {
  const [localFaqs, setLocalFaqs] = useState<FaqUiDraft[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [header, setHeader] = useState("");
  const [summary, setSummary] = useState("");
  const [expandedId, setExpandedId] = useState<string | false>(false);

  const formRef = useRef<HTMLDivElement>(null);

  const isValid = header.trim().length > 0;
  const isEditing = editingId !== null;

  useEffect(() => {
    if (open) {
      setLocalFaqs(
        faqs.map((faq, index) => ({
          ...faq,
          id: `faq-${index}-${faq.header}`,
        }))
      );
    }
  }, [open, faqs]);

  useEffect(() => {
    if (showForm && editingId) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showForm, editingId]);

  const resetForm = () => {
    setEditingId(null);
    setHeader("");
    setSummary("");
  };

  const handleOpenForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleStartEdit = (faq: FaqUiDraft) => {
    setEditingId(faq.id);
    setHeader(faq.header);
    setSummary(faq.summary);
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
      setLocalFaqs((prev) =>
        prev.map((faq) =>
          faq.id === editingId
            ? { ...faq, header: header.trim(), summary: summary.trim() }
            : faq
        )
      );
    } else {
      setLocalFaqs((prev) => [
        ...prev,
        {
          id: createId(),
          header: header.trim(),
          summary: summary.trim(),
          order: prev.length,
        },
      ]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    setLocalFaqs((prev) => reindex(prev.filter((faq) => faq.id !== id)));
    setExpandedId((current) => (current === id ? false : current));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    setLocalFaqs((prev) => {
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
    onFaqsChange(
      localFaqs.map(({ header, summary, order }) => ({ header, summary, order }))
    );
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
          <Typography variant="h6">FAQs</Typography>
          <Divider flexItem />

          {localFaqs.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 1 }}>
              No FAQs yet. Add one below.
            </Typography>
          ) : (
            localFaqs.map((faq, index) => (
              <Stack
                key={faq.id}
                sx={{
                  width: "100%",
                  gap: 1,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 1,
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
                      aria-label="Move FAQ up"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Move FAQ down"
                      disabled={index === localFaqs.length - 1}
                      onClick={() => handleMove(index, 1)}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", ml: 0.5 }}
                    >
                      {`order: ${faq.order}`}
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
                      aria-label="Edit FAQ"
                      onClick={() => handleStartEdit(faq)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Remove FAQ"
                      onClick={() => handleRemove(faq.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>

                <Accordion
                  expanded={expandedId === faq.id}
                  onChange={(_, expanded) =>
                    setExpandedId(expanded ? faq.id : false)
                  }
                  disableGutters
                  sx={{
                    width: "100%",
                    border: (theme) =>
                      `1px solid ${theme.palette.primary.main}33`,
                    borderRadius: 1,
                    "&::before": { display: "none" },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontFamily: "Namecat",
                        color: "primary.main",
                        fontSize: { xs: 13, md: 15 },
                      }}
                    >
                      {faq.header}
                    </Typography>
                  </AccordionSummary>

                  <Divider flexItem sx={{ mx: 1 }} />

                  <AccordionDetails sx={{ width: "100%", p: 1.5 }}>
                    {faq.summary.trim() ? (
                      <Typography
                        component="div"
                        sx={{
                          width: "100%",
                          maxHeight: FAQ_SUMMARY_MAX_HEIGHT,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: { xs: 5, md: 4 },
                          whiteSpace: "pre-line",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          fontSize: { xs: 12, md: 14 },
                          lineHeight: 1.6,
                          color: "text.primary",
                        }}
                      >
                        {faq.summary}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontStyle: "italic" }}
                      >
                        No summary provided.
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
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
                {isEditing ? "Edit FAQ" : "New FAQ"}
              </Typography>

              <TextField
                label="Header"
                variant="standard"
                value={header}
                onChange={(event) => setHeader(event.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Summary"
                variant="outlined"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                multiline
                minRows={3}
                fullWidth
              />

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
              Add FAQ
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

export default AddFAQ;
