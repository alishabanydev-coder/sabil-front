import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { secondaryModalSlotProps } from "./secondaryModalBackdrop";
import type {
  ProjectStepDraft,
  ProjectStepStatus,
} from "./donationDrafts";

const STEP_STATUSES: { value: ProjectStepStatus; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "skipped", label: "Skipped" },
];

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `step-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const reindex = (steps: ProjectStepDraft[]) =>
  steps.map((step, index) => ({ ...step, order: index }));

const AddSteps = ({
  open,
  onClose,
  steps,
  onStepsChange,
}: {
  open: boolean;
  onClose: () => void;
  steps: ProjectStepDraft[];
  onStepsChange: (steps: ProjectStepDraft[]) => void;
}) => {
  const [localSteps, setLocalSteps] = useState<ProjectStepDraft[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState<ProjectStepStatus>("upcoming");
  const [spentAmount, setSpentAmount] = useState("0");
  const formRef = useRef<HTMLDivElement>(null);

  const isValid = label.trim().length > 0;
  const isEditing = editingId !== null;
  const spentDisabled = status === "upcoming";

  useEffect(() => {
    if (open) {
      setLocalSteps(reindex(steps));
      setShowForm(false);
      setEditingId(null);
      setLabel("");
      setStatus("upcoming");
      setSpentAmount("0");
    }
  }, [open, steps]);

  useEffect(() => {
    if (showForm && editingId) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showForm, editingId]);

  const resetForm = () => {
    setEditingId(null);
    setLabel("");
    setStatus("upcoming");
    setSpentAmount("0");
  };

  const handleOpenForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleStartEdit = (step: ProjectStepDraft) => {
    setEditingId(step.id);
    setLabel(step.label);
    setStatus(step.status);
    setSpentAmount(String(step.spentAmount ?? 0));
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!isValid) {
      return;
    }

    const nextSpent = spentDisabled
      ? 0
      : Math.max(0, Number(spentAmount) || 0);

    if (editingId) {
      setLocalSteps((prev) =>
        prev.map((step) =>
          step.id === editingId
            ? {
                ...step,
                label: label.trim(),
                status,
                spentAmount: nextSpent,
              }
            : step
        )
      );
    } else {
      setLocalSteps((prev) =>
        reindex([
          ...prev,
          {
            id: createId(),
            label: label.trim(),
            status,
            spentAmount: nextSpent,
            order: prev.length,
          },
        ])
      );
    }

    resetForm();
    setShowForm(false);
  };

  const handleSave = () => {
    onStepsChange(reindex(localSteps));
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
          <Typography variant="h6">Project steps</Typography>
          <Divider flexItem />

          {localSteps.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 1 }}>
              No steps yet. Add production stages such as Writing or Modeling.
            </Typography>
          ) : (
            localSteps.map((step, index) => (
              <Stack
                key={step.id}
                sx={{
                  width: "100%",
                  gap: 0.5,
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
                      disabled={index === 0}
                      onClick={() => {
                        setLocalSteps((prev) => {
                          const next = [...prev];
                          [next[index - 1], next[index]] = [
                            next[index],
                            next[index - 1],
                          ];
                          return reindex(next);
                        });
                      }}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={index === localSteps.length - 1}
                      onClick={() => {
                        setLocalSteps((prev) => {
                          const next = [...prev];
                          [next[index + 1], next[index]] = [
                            next[index],
                            next[index + 1],
                          ];
                          return reindex(next);
                        });
                      }}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {step.label}
                    </Typography>
                  </Stack>
                  <Stack sx={{ flexDirection: "row" }}>
                    <IconButton size="small" onClick={() => handleStartEdit(step)}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setLocalSteps((prev) =>
                          reindex(prev.filter((item) => item.id !== step.id))
                        )
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {step.status.replace("_", " ")}
                  {step.spentAmount > 0 ? ` · spent ${step.spentAmount}` : ""}
                </Typography>
              </Stack>
            ))
          )}

          {showForm ? (
            <Stack ref={formRef} sx={{ gap: 1.5, pt: 1 }}>
              <TextField
                label="Label"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Status"
                value={status}
                onChange={(event) => {
                  const next = event.target.value as ProjectStepStatus;
                  setStatus(next);
                  if (next === "upcoming") {
                    setSpentAmount("0");
                  }
                }}
                fullWidth
              >
                {STEP_STATUSES.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Spent amount"
                type="number"
                value={spentAmount}
                disabled={spentDisabled}
                helperText={
                  spentDisabled
                    ? "Upcoming steps have no spend yet."
                    : "Only steps with spend appear on the public pie chart."
                }
                onChange={(event) => setSpentAmount(event.target.value)}
                slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                fullWidth
              />
              <Stack sx={{ flexDirection: "row", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
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
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
            >
              Add step
            </Button>
          )}
        </Stack>

        <Divider flexItem />
        <Stack sx={{ flexDirection: "row", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default AddSteps;
