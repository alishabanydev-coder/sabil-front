import { Button, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchDonationProjects } from "../services/donationApi";
import {
  createSiteUser,
  createSiteUserDonation,
  deleteDonation,
  deleteSiteUser,
  fetchSiteUser,
  fetchSiteUsers,
  updateDonation,
  updateSiteUser,
} from "../services/siteUsersApi";

export type UserRecord = {
  id: string;
  username: string;
  email: string;
  showAsAnonymousInDonations: boolean;
  donationProjects: string[];
  donationCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type DonationProjectOption = {
  _id: string;
  title: string;
};

export type UserDonationRecord = {
  id: string;
  donationProjectId: string;
  projectTitle: string;
  amount: number;
  currency: string;
  source: string;
  createdAt: string;
};

export type DonationSource = "manual" | "patreon" | "whatsapp";

export type EditPanel = "profile" | "donations";

function getDonationProjectTitle(donation: any) {
  const project = donation?.donationProjectId;

  if (project && typeof project === "object") {
    return project.title || project._id?.toString?.() || "Unknown project";
  }

  if (typeof project === "string" && project && project !== "[object Object]") {
    return project;
  }

  return "Unknown project";
}

function getDonationProjectId(donation: any) {
  const project = donation?.donationProjectId;

  if (project && typeof project === "object") {
    return project._id?.toString?.() || "";
  }

  if (typeof project === "string" && project && project !== "[object Object]") {
    return project;
  }

  return "";
}

function mapUserDonationRow(donation: any): UserDonationRecord {
  return {
    id: donation._id,
    donationProjectId: getDonationProjectId(donation),
    projectTitle: getDonationProjectTitle(donation),
    amount: Number(donation.amount ?? 0),
    currency: donation.currency || "",
    source: donation.source || "manual",
    createdAt: donation.createdAt || "",
  };
}

export const useAdminUsers = () => {
  const [filterUsername, setFilterUsername] = useState("");
  const [filterTargetType, setFilterTargetType] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [rows, setRows] = useState<UserRecord[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addDonationOpen, setAddDonationOpen] = useState(false);
  const [editDonationOpen, setEditDonationOpen] = useState(false);
  const [editPanel, setEditPanel] = useState<EditPanel>("profile");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(
    null
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [addUsername, setAddUsername] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addConfirmPassword, setAddConfirmPassword] = useState("");
  const [addShowAsAnonymousInDonations, setAddShowAsAnonymousInDonations] =
    useState(false);
  const [showAsAnonymousInDonations, setShowAsAnonymousInDonations] =
    useState(false);
  const [userDonations, setUserDonations] = useState<UserDonationRecord[]>([]);
  const [isLoadingDonations, setIsLoadingDonations] = useState(false);
  const [donationsErrorMsg, setDonationsErrorMsg] = useState("");
  const [donationProjectOptions, setDonationProjectOptions] = useState<
    DonationProjectOption[]
  >([]);
  const [selectedDonationProjectId, setSelectedDonationProjectId] =
    useState("");
  const [editDonationProjectTitle, setEditDonationProjectTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [source, setSource] = useState<DonationSource>("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isAddingDonation, setIsAddingDonation] = useState(false);
  const [isUpdatingDonation, setIsUpdatingDonation] = useState(false);
  const [isDeletingDonationId, setIsDeletingDonationId] = useState<
    string | null
  >(null);
  const [isDeletingUserId, setIsDeletingUserId] = useState<string | null>(null);
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [addUserErrorMsg, setAddUserErrorMsg] = useState("");
  const [addDonationErrorMsg, setAddDonationErrorMsg] = useState("");
  const [editDonationErrorMsg, setEditDonationErrorMsg] = useState("");
  const [isFetchingDonationProjects, setIsFetchingDonationProjects] =
    useState(false);

  const mapUserRow = useCallback(
    (user: any): UserRecord => ({
      id: user._id,
      username: user.displayName || "",
      email: user.email || "",
      showAsAnonymousInDonations: Boolean(user.showAsAnonymousInDonations),
      donationProjects: Array.isArray(user.donatedProjects)
        ? user.donatedProjects
        : [],
      donationCount: Number(user.donationCount ?? 0),
      totalAmount: Number(user.totalAmount ?? 0),
      createdAt: user.createdAt || "",
      updatedAt: user.updatedAt || "",
    }),
    []
  );

  const resetEditForm = useCallback(() => {
    setSelectedUserId(null);
    setUsername("");
    setEmail("");
    setShowAsAnonymousInDonations(false);
    setEditPanel("profile");
    setUserDonations([]);
    setDonationsErrorMsg("");
    setSubmitErrorMsg("");
  }, []);

  const resetAddUserForm = useCallback(() => {
    setAddUsername("");
    setAddEmail("");
    setAddPassword("");
    setAddConfirmPassword("");
    setAddShowAsAnonymousInDonations(false);
    setAddUserErrorMsg("");
  }, []);

  const resetAddDonationForm = useCallback(() => {
    setSelectedDonationProjectId("");
    setAmount("");
    setCurrency("USD");
    setSource("manual");
    setAddDonationErrorMsg("");
  }, []);

  const resetEditDonationForm = useCallback(() => {
    setSelectedDonationId(null);
    setEditDonationProjectTitle("");
    setAmount("");
    setCurrency("USD");
    setSource("manual");
    setEditDonationErrorMsg("");
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditOpen(false);
    resetEditForm();
  }, [resetEditForm]);

  const handleCloseAddUser = useCallback(() => {
    setAddUserOpen(false);
    resetAddUserForm();
  }, [resetAddUserForm]);

  const handleOpenAddUser = useCallback(() => {
    resetAddUserForm();
    setAddUserOpen(true);
  }, [resetAddUserForm]);

  const handleCloseAddDonation = useCallback(() => {
    setAddDonationOpen(false);
    resetAddDonationForm();
  }, [resetAddDonationForm]);

  const handleCloseEditDonation = useCallback(() => {
    setEditDonationOpen(false);
    resetEditDonationForm();
  }, [resetEditDonationForm]);

  const loadDonationProjects = useCallback(async (signal?: AbortSignal) => {
    setIsFetchingDonationProjects(true);

    const result = await fetchDonationProjects({ signal });
    if (!result.ok) {
      setIsFetchingDonationProjects(false);
      return;
    }

    setDonationProjectOptions(
      result.donationProjects.map((project: any) => ({
        _id: project._id,
        title: project.title || project._id,
      }))
    );
    setIsFetchingDonationProjects(false);
  }, []);

  const loadUsers = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setErrorMsg("");

      const result = await fetchSiteUsers({ signal });
      if (!result.ok) {
        setLoading(false);
        setErrorMsg(result.message);
        return;
      }

      setRows(result.users.map(mapUserRow));
      setLoading(false);
    },
    [mapUserRow]
  );

  const loadUserDonations = useCallback(async (userId: string) => {
    setIsLoadingDonations(true);
    setDonationsErrorMsg("");

    const result = await fetchSiteUser(userId);
    setIsLoadingDonations(false);

    if (!result.ok) {
      setDonationsErrorMsg(result.message);
      setUserDonations([]);
      return;
    }

    setUserDonations(result.donations.map(mapUserDonationRow));
  }, []);

  const refreshUserDonations = useCallback(async () => {
    if (!selectedUserId) {
      return;
    }

    await Promise.all([loadUsers(), loadUserDonations(selectedUserId)]);
  }, [loadUserDonations, loadUsers, selectedUserId]);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      loadUsers(controller.signal),
      loadDonationProjects(controller.signal),
    ]).catch((error) => {
      if (!controller.signal.aborted) {
        setLoading(false);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load users."
        );
      }
    });

    return () => controller.abort("Users tab unmounted");
  }, [loadDonationProjects, loadUsers]);

  const filteredRows = useMemo(() => {
    const query = filterUsername.trim().toLowerCase();
    if (!query) {
      return rows;
    }

    return rows.filter(
      (row) =>
        row.username.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query)
    );
  }, [filterUsername, rows]);

  const openEditUserModal = useCallback(
    (user: UserRecord) => {
      setSelectedUserId(user.id);
      setUsername(user.username);
      setEmail(user.email);
      setShowAsAnonymousInDonations(user.showAsAnonymousInDonations);
      setEditPanel("profile");
      setSubmitErrorMsg("");
      setEditOpen(true);
      void loadUserDonations(user.id);
    },
    [loadUserDonations]
  );

  const handleEditUser = useCallback(
    (user: UserRecord) => {
      openEditUserModal(user);
    },
    [openEditUserModal]
  );

  const handleShowDonations = useCallback(() => {
    setEditPanel("donations");
    if (selectedUserId) {
      void loadUserDonations(selectedUserId);
    }
  }, [loadUserDonations, selectedUserId]);

  const handleOpenAddDonation = useCallback(() => {
    resetAddDonationForm();
    setAddDonationOpen(true);
  }, [resetAddDonationForm]);

  const handleOpenEditDonation = useCallback((donation: UserDonationRecord) => {
    setSelectedDonationId(donation.id);
    setEditDonationProjectTitle(donation.projectTitle);
    setAmount(String(donation.amount));
    setCurrency(donation.currency || "USD");
    setSource(
      donation.source === "patreon" || donation.source === "whatsapp"
        ? donation.source
        : "manual"
    );
    setEditDonationErrorMsg("");
    setEditDonationOpen(true);
  }, []);

  const handleDeleteDonation = useCallback(
    async (donation: UserDonationRecord) => {
      const confirmed = window.confirm(
        `Delete donation of ${donation.amount} ${donation.currency} for "${donation.projectTitle}"?`
      );

      if (!confirmed || !selectedUserId) {
        return;
      }

      setIsDeletingDonationId(donation.id);

      const result = await deleteDonation(donation.id);
      setIsDeletingDonationId(null);

      if (!result.ok) {
        setDonationsErrorMsg(result.message);
        return;
      }

      setDonationsErrorMsg("");
      await refreshUserDonations();
    },
    [refreshUserDonations, selectedUserId]
  );

  const handleDeleteUser = useCallback(
    async (user: UserRecord) => {
      const confirmed = window.confirm(
        `Deactivate user "${user.username}"? They will no longer be able to sign in, but their donations will be kept.`
      );

      if (!confirmed) {
        return;
      }

      if (editOpen && selectedUserId === user.id) {
        handleCloseEdit();
      }

      setIsDeletingUserId(user.id);
      setErrorMsg("");

      const result = await deleteSiteUser(user.id);
      setIsDeletingUserId(null);

      if (!result.ok) {
        setErrorMsg(result.message);
        return;
      }

      setRows((currentRows) => currentRows.filter((row) => row.id !== user.id));
    },
    [editOpen, handleCloseEdit, selectedUserId]
  );

  const isProfileSaveDisabled = useMemo(() => {
    return isSubmitting || !username.trim() || !selectedUserId;
  }, [isSubmitting, selectedUserId, username]);

  const isCreateUserDisabled = useMemo(() => {
    return (
      isCreatingUser ||
      !addUsername.trim() ||
      !addEmail.trim() ||
      !addPassword ||
      !addConfirmPassword ||
      addPassword.length < 6 ||
      addPassword !== addConfirmPassword
    );
  }, [
    addConfirmPassword,
    addEmail,
    addPassword,
    addUsername,
    isCreatingUser,
  ]);

  const isAddDonationDisabled = useMemo(() => {
    const parsedAmount = Number(amount);
    return (
      isAddingDonation ||
      !selectedUserId ||
      !selectedDonationProjectId ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount < 0
    );
  }, [amount, isAddingDonation, selectedDonationProjectId, selectedUserId]);

  const isEditDonationDisabled = useMemo(() => {
    const parsedAmount = Number(amount);
    return (
      isUpdatingDonation ||
      !selectedDonationId ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount < 0
    );
  }, [amount, isUpdatingDonation, selectedDonationId]);

  const handleSaveProfile = useCallback(async () => {
    if (!selectedUserId || isProfileSaveDisabled) {
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMsg("");

    const result = await updateSiteUser(selectedUserId, {
      displayName: username.trim(),
      showAsAnonymousInDonations,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitErrorMsg(result.message);
      return;
    }

    handleCloseEdit();
    await loadUsers();
  }, [
    handleCloseEdit,
    isProfileSaveDisabled,
    loadUsers,
    selectedUserId,
    showAsAnonymousInDonations,
    username,
  ]);

  const handleCreateUser = useCallback(async () => {
    if (isCreateUserDisabled) {
      return;
    }

    setIsCreatingUser(true);
    setAddUserErrorMsg("");

    const result = await createSiteUser({
      displayName: addUsername.trim(),
      email: addEmail.trim().toLowerCase(),
      password: addPassword,
      showAsAnonymousInDonations: addShowAsAnonymousInDonations,
    });

    setIsCreatingUser(false);

    if (!result.ok) {
      setAddUserErrorMsg(result.message);
      return;
    }

    handleCloseAddUser();
    await loadUsers();
  }, [
    addEmail,
    addPassword,
    addShowAsAnonymousInDonations,
    addUsername,
    handleCloseAddUser,
    isCreateUserDisabled,
    loadUsers,
  ]);

  const handleAddDonation = useCallback(async () => {
    if (!selectedUserId || isAddDonationDisabled) {
      return;
    }

    setIsAddingDonation(true);
    setAddDonationErrorMsg("");

    const parsedAmount = Number(amount);
    const result = await createSiteUserDonation(selectedUserId, {
      donationProjectId: selectedDonationProjectId,
      amount: parsedAmount,
      currency,
      source: "manual",
    });

    setIsAddingDonation(false);

    if (!result.ok) {
      setAddDonationErrorMsg(result.message);
      return;
    }

    handleCloseAddDonation();
    setEditPanel("donations");
    await refreshUserDonations();
  }, [
    amount,
    currency,
    handleCloseAddDonation,
    isAddDonationDisabled,
    refreshUserDonations,
    selectedDonationProjectId,
    selectedUserId,
  ]);

  const handleUpdateDonation = useCallback(async () => {
    if (!selectedDonationId || isEditDonationDisabled) {
      return;
    }

    setIsUpdatingDonation(true);
    setEditDonationErrorMsg("");

    const parsedAmount = Number(amount);
    const result = await updateDonation(selectedDonationId, {
      amount: parsedAmount,
      currency,
      source,
    });

    setIsUpdatingDonation(false);

    if (!result.ok) {
      setEditDonationErrorMsg(result.message);
      return;
    }

    handleCloseEditDonation();
    setEditPanel("donations");
    await refreshUserDonations();
  }, [
    amount,
    currency,
    handleCloseEditDonation,
    isEditDonationDisabled,
    refreshUserDonations,
    selectedDonationId,
    source,
  ]);

  const columns: GridColDef<UserRecord>[] = useMemo(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack
            direction="row"
            sx={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              py: 0.5,
            }}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleEditUser(params.row)}
              sx={{ fontSize: 11 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              disabled={isDeletingUserId === params.row.id}
              onClick={() => void handleDeleteUser(params.row)}
              sx={{ fontSize: 11 }}
            >
              {isDeletingUserId === params.row.id ? "..." : "Delete"}
            </Button>
          </Stack>
        ),
      },
      { field: "id", headerName: "ID", width: 120 },
      { field: "username", headerName: "Username", width: 150 },
      { field: "email", headerName: "Email", width: 150 },
      {
        field: "donationCount",
        headerName: "Donations",
        width: 110,
      },
      {
        field: "totalAmount",
        headerName: "Total Amount",
        width: 130,
      },
    ],
    [handleDeleteUser, handleEditUser, isDeletingUserId]
  );

  return {
    addConfirmPassword,
    addDonationErrorMsg,
    addDonationOpen,
    addEmail,
    addPassword,
    addShowAsAnonymousInDonations,
    addUserErrorMsg,
    addUserOpen,
    addUsername,
    amount,
    columns,
    currency,
    donationProjectOptions,
    donationsErrorMsg,
    editDonationErrorMsg,
    editDonationOpen,
    editDonationProjectTitle,
    editOpen,
    editPanel,
    email,
    errorMsg,
    filteredRows,
    filterTargetType,
    filterUsername,
    handleAddDonation,
    handleCloseAddDonation,
    handleCloseAddUser,
    handleCloseEdit,
    handleCloseEditDonation,
    handleCreateUser,
    handleDeleteDonation,
    handleOpenAddDonation,
    handleOpenAddUser,
    handleOpenEditDonation,
    handleSaveProfile,
    handleShowDonations,
    handleUpdateDonation,
    isAddingDonation,
    isAddDonationDisabled,
    isCreateUserDisabled,
    isCreatingUser,
    isDeletingDonationId,
    isEditDonationDisabled,
    isFetchingDonationProjects,
    isLoadingDonations,
    isProfileSaveDisabled,
    isSubmitting,
    isUpdatingDonation,
    loading,
    selectedDonationProjectId,
    setAddConfirmPassword,
    setAddEmail,
    setAddPassword,
    setAddShowAsAnonymousInDonations,
    setAddUsername,
    setAmount,
    setCurrency,
    setFilterTargetType,
    setFilterUsername,
    setSelectedDonationProjectId,
    setShowAsAnonymousInDonations,
    setSource,
    setUsername,
    showAsAnonymousInDonations,
    source,
    submitErrorMsg,
    userDonations,
    username,
  };
};
