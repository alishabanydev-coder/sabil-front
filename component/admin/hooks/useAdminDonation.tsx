import type { AdminDonationProjectRecord } from "@/types/admin";
import { useCallback, useEffect, useState } from "react";
import {
  deleteDonationProject,
  fetchDonationProjects,
  revalidateDonationProjectsPublicCache,
} from "../services/donationApi";

export const useAdminDonation = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [donationProjects, setDonationProjects] = useState<
    AdminDonationProjectRecord[]
  >([]);
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

  const handleAddDonation = useCallback(() => {
    setIsEditing(false);
    setEditingProjectId(null);
    setOpen(true);
  }, []);

  const handleEditDonation = useCallback((projectId: string) => {
    setIsEditing(true);
    setEditingProjectId(projectId);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setIsEditing(false);
    setEditingProjectId(null);
  }, []);

  const handleDeleteDonation = useCallback(
    async (projectId: string) => {
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
    },
    [loadDonationProjects]
  );

  return {
    deletingId,
    donationProjects,
    editingProjectId,
    errorMsg,
    handleAddDonation,
    handleClose,
    handleDeleteDonation,
    handleEditDonation,
    isEditing,
    loadDonationProjects,
    loading,
    open,
  };
};
