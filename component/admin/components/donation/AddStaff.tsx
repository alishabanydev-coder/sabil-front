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
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { secondaryModalSlotProps } from "./secondaryModalBackdrop";
import type { StaffMemberDraft } from "./donationDrafts";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `staff-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const reindex = (staff: StaffMemberDraft[]) =>
  staff.map((member, index) => ({ ...member, order: index }));

const AddStaff = ({
  open,
  onClose,
  staff,
  onStaffChange,
}: {
  open: boolean;
  onClose: () => void;
  staff: StaffMemberDraft[];
  onStaffChange: (staff: StaffMemberDraft[]) => void;
}) => {
  const [localStaff, setLocalStaff] = useState<StaffMemberDraft[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const isValid = name.trim().length > 0 && role.trim().length > 0;
  const isEditing = editingId !== null;

  useEffect(() => {
    if (open) {
      setLocalStaff(reindex(staff));
      setShowForm(false);
      setEditingId(null);
      setName("");
      setRole("");
      setPhoto("");
      setBio("");
    }
  }, [open, staff]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setPhoto("");
    setBio("");
  };

  const handleStartEdit = (member: StaffMemberDraft) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setPhoto(member.photo);
    setBio(member.bio);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!isValid) {
      return;
    }

    const nextMember = {
      name: name.trim(),
      role: role.trim(),
      photo: photo.trim(),
      bio: bio.trim(),
    };

    if (editingId) {
      setLocalStaff((prev) =>
        prev.map((member) =>
          member.id === editingId ? { ...member, ...nextMember } : member
        )
      );
    } else {
      setLocalStaff((prev) =>
        reindex([
          ...prev,
          {
            id: createId(),
            ...nextMember,
            order: prev.length,
          },
        ])
      );
    }

    resetForm();
    setShowForm(false);
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
          <Typography variant="h6">Project staff</Typography>
          <Divider flexItem />

          {localStaff.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 1 }}>
              No staff yet. Add crew who work on this campaign.
            </Typography>
          ) : (
            localStaff.map((member, index) => (
              <Stack
                key={member.id}
                sx={{
                  width: "100%",
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
                  <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      disabled={index === 0}
                      onClick={() => {
                        setLocalStaff((prev) => {
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
                      disabled={index === localStaff.length - 1}
                      onClick={() => {
                        setLocalStaff((prev) => {
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
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.role}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{ flexDirection: "row" }}>
                    <IconButton size="small" onClick={() => handleStartEdit(member)}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setLocalStaff((prev) =>
                          reindex(prev.filter((item) => item.id !== member.id))
                        )
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            ))
          )}

          {showForm ? (
            <Stack ref={formRef} sx={{ gap: 1.5, pt: 1 }}>
              <TextField
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
              />
              <TextField
                label="Role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                fullWidth
              />
              <TextField
                label="Photo URL"
                value={photo}
                onChange={(event) => setPhoto(event.target.value)}
                helperText="Optional. Use an uploaded image path or public URL."
                fullWidth
              />
              <TextField
                label="Bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                multiline
                minRows={2}
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
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              Add staff
            </Button>
          )}
        </Stack>

        <Divider flexItem />
        <Stack sx={{ flexDirection: "row", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onStaffChange(reindex(localStaff));
              onClose();
            }}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default AddStaff;
