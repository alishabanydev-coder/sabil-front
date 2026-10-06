import type {
  AdminDonationCommentRecord,
  AdminDonationProjectRecord,
} from "@/types/admin";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchDonationPageComments,
  updateDonationPageComments,
} from "../services/commentsApi";
import {
  deleteDonationProject,
  fetchDonationProjects,
  revalidateDonationProjectsPublicCache,
} from "../services/donationApi";

function sortDonationComments(items: AdminDonationCommentRecord[]) {
  return items
    .filter((item) => Boolean(item.showInDonationPage))
    .sort((firstItem, secondItem) => {
      const firstOrder =
        typeof firstItem.donationPageOrder === "number"
          ? firstItem.donationPageOrder
          : Number.MAX_SAFE_INTEGER;
      const secondOrder =
        typeof secondItem.donationPageOrder === "number"
          ? secondItem.donationPageOrder
          : Number.MAX_SAFE_INTEGER;
      return firstOrder - secondOrder;
    });
}

export const useAdminDonation = () => {
  const [open, setOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [donationProjects, setDonationProjects] = useState<
    AdminDonationProjectRecord[]
  >([]);
  const [donationComments, setDonationComments] = useState<
    AdminDonationCommentRecord[]
  >([]);
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsModalLoading, setCommentsModalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [commentsErrorMsg, setCommentsErrorMsg] = useState("");
  const [isSavingComments, setIsSavingComments] = useState(false);
  const [commentsSaveErrorMsg, setCommentsSaveErrorMsg] = useState("");
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

  const loadDonationComments = useCallback(
    async ({
      signal,
      forModal = false,
    }: { signal?: AbortSignal; forModal?: boolean } = {}) => {
      if (forModal) {
        setCommentsModalLoading(true);
      } else {
        setCommentsLoading(true);
      }
      setCommentsErrorMsg("");

      try {
        const result = await fetchDonationPageComments({ signal });

        if (!result.ok) {
          if (!forModal) {
            setDonationComments([]);
          }
          setCommentsErrorMsg(result.message);
          return null;
        }

        setDonationComments(result.items);
        return result.items;
      } catch (error) {
        if (signal?.aborted) {
          return null;
        }

        if (!forModal) {
          setDonationComments([]);
        }
        setCommentsErrorMsg(
          error instanceof Error
            ? error.message
            : "Failed to load donation comments."
        );
        return null;
      } finally {
        if (!signal?.aborted) {
          if (forModal) {
            setCommentsModalLoading(false);
          } else {
            setCommentsLoading(false);
          }
        }
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadDonationProjects();
    void loadDonationComments({ signal: controller.signal });

    return () => controller.abort("Donation panel unmounted");
  }, [loadDonationComments, loadDonationProjects]);

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

  const handleOpenComments = useCallback(() => {
    setCommentsOpen(true);
    setCommentsSaveErrorMsg("");
    setSelectedCommentIds(
      sortDonationComments(donationComments).map((item) => item._id)
    );

    void loadDonationComments({ forModal: true }).then((items) => {
      if (!items) {
        return;
      }

      setSelectedCommentIds(
        sortDonationComments(items).map((item) => item._id)
      );
    });
  }, [donationComments, loadDonationComments]);

  const handleCloseComments = useCallback(() => {
    if (isSavingComments) {
      return;
    }

    setCommentsOpen(false);
    setSelectedCommentIds([]);
    setCommentsSaveErrorMsg("");
  }, [isSavingComments]);

  const toggleCommentSelection = useCallback(
    (itemId: string) => {
      if (isSavingComments) {
        return;
      }

      setSelectedCommentIds((currentIds) =>
        currentIds.includes(itemId)
          ? currentIds.filter((id) => id !== itemId)
          : [...currentIds, itemId]
      );
    },
    [isSavingComments]
  );

  const handleSaveComments = useCallback(async () => {
    setIsSavingComments(true);
    setCommentsSaveErrorMsg("");

    try {
      const result = await updateDonationPageComments(selectedCommentIds);

      if (!result.ok) {
        setCommentsSaveErrorMsg(
          result.message || "Failed to save comment selection."
        );
        return;
      }

      setDonationComments(result.items);
      setCommentsOpen(false);
      setSelectedCommentIds([]);
    } catch (error) {
      setCommentsSaveErrorMsg(
        error instanceof Error ? error.message : "Failed to save comments."
      );
    } finally {
      setIsSavingComments(false);
    }
  }, [selectedCommentIds]);

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

  const selectedDonationComments = useMemo(
    () => sortDonationComments(donationComments),
    [donationComments]
  );

  return {
    commentsErrorMsg,
    commentsLoading,
    commentsModalLoading,
    commentsOpen,
    commentsSaveErrorMsg,
    deletingId,
    donationComments,
    donationProjects,
    editingProjectId,
    errorMsg,
    handleAddDonation,
    handleClose,
    handleCloseComments,
    handleDeleteDonation,
    handleEditDonation,
    handleOpenComments,
    handleSaveComments,
    isEditing,
    isSavingComments,
    loadDonationProjects,
    loading,
    open,
    selectedCommentIds,
    selectedDonationComments,
    toggleCommentSelection,
  };
};
