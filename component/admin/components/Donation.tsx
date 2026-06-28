import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import DonationModal from "./donation/DonationModal";
import {
  deleteDonationProject,
  fetchDonationProjects,
  revalidateDonationProjectsPublicCache,
} from "../services/donationApi";

type DonationProjectRecord = {
  _id: string;
  title: string;
  status?: string;
  goalAmount?: number;
  raisedAmount?: number;
  currency?: string;
  listOrder?: number | null;
  showOnDonationPage?: boolean;
};

const Donation = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [donationProjects, setDonationProjects] = useState<DonationProjectRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadDonationProjects = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await fetchDonationProjects();

      if (!result.ok) {
        setDonationProjects([]);
        setErrorMsg(result.message);
        return;
      }

      setDonationProjects(result.donationProjects);
    } catch (error) {
      setDonationProjects([]);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Failed to load donation projects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDonationProjects();
  }, [loadDonationProjects]);

  const handleAddDonation = () => {
    setIsEditing(false);
    setEditingProjectId(null);
    setOpen(true);
  };

  const handleEditDonation = (projectId: string) => {
    setIsEditing(true);
    setEditingProjectId(projectId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingProjectId(null);
  };

  const handleDeleteDonation = async (projectId: string) => {
    setDeletingId(projectId);
    setErrorMsg("");

    try {
      const result = await deleteDonationProject(projectId);

      if (!result.ok) {
        setErrorMsg(result.message);
        return;
      }

      await revalidateDonationProjectsPublicCache();
      await loadDonationProjects();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          height: "calc(100vh - 60px)",
          mt: 3,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
        }}
      >
        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: -20,
            right: 0,
          }}
        >
          <Button
            sx={{
              width: 200,
              boxShadow: (theme) =>
                `0px 2px 12px 1px ${theme.palette.primary.main}`,
            }}
            variant="contained"
            color="primary"
            onClick={handleAddDonation}
          >
            Add Donation
          </Button>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            height: "100%",
            pt: 6,
            px: 2,
            pb: 2,
            overflow: "auto",
            gap: 1.5,
          }}
        >
          {loading ? (
            <Stack sx={{ alignItems: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : errorMsg ? (
            <Typography variant="body2" sx={{ color: "error.main" }}>
              {errorMsg}
            </Typography>
          ) : donationProjects.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 2 }}>
              No donation projects yet.
            </Typography>
          ) : (
            donationProjects.map((project) => (
              <Stack
                key={project._id}
                sx={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Stack sx={{ gap: 0.5 }}>
                  <Typography sx={{ fontWeight: 700 }}>{project.title}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {`${project.status ?? "ongoing"} · ${project.currency ?? "USD"} ${project.raisedAmount ?? 0} / ${project.goalAmount ?? 0}`}
                    {project.listOrder ? ` · order ${project.listOrder}` : ""}
                  </Typography>
                </Stack>

                <Stack sx={{ flexDirection: "row", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="Edit donation project"
                    onClick={() => handleEditDonation(project._id)}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Delete donation project"
                    disabled={deletingId === project._id}
                    onClick={() => void handleDeleteDonation(project._id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            ))
          )}
        </Stack>
      </Stack>

      <DonationModal
        open={open}
        isEditing={isEditing}
        editingProjectId={editingProjectId}
        onClose={handleClose}
        onSaved={loadDonationProjects}
      />
    </Stack>
  );
};

export default Donation;
