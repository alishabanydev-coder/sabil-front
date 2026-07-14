import type { SupporterRecord } from "@/types/admin";
import { IconButton, Stack } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ReadOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, fetchUsers } from "../services/usersApi";

function mapSupporterRow(user: any): SupporterRecord {
  return {
    id: user._id,
    _id: user._id,
    username: user.name || "",
    message: user.message || "",
    phoneNumbers: Array.isArray(user.phoneNumbers) ? user.phoneNumbers : [],
    email: user.email || "",
    createdAt: user.createdAt || "",
    updatedAt: user.updatedAt || "",
  };
}

export const useAdminSupporters = () => {
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [rows, setRows] = useState<SupporterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setSelectedUserId(null);
    setModalMode("add");
    setUsername("");
    setEmail("");
    setMessage("");
    setPhoneNumbers("");
    setSubmitErrorMsg("");
  }, []);

  const loadUsers = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setErrorMsg("");

    const result = await fetchUsers({ signal });
    if (!result.ok) {
      setLoading(false);
      setErrorMsg(result.message);
      return;
    }

    setRows(result.users.map(mapSupporterRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadUsers(controller.signal).catch((error) => {
      if (!controller.signal.aborted) {
        setLoading(false);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load users."
        );
      }
    });

    return () => controller.abort("Users tab unmounted");
  }, [loadUsers]);

  const handleOpenUserModal = useCallback((user: SupporterRecord) => {
    setSelectedUserId(user._id);
    setModalMode("edit");
    setUsername(user.username || "");
    setEmail(user.email || "");
    setMessage(user.message || "");
    setPhoneNumbers(
      Array.isArray(user.phoneNumbers) ? user.phoneNumbers.join(", ") : ""
    );
    setSubmitErrorMsg("");
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm]);

  const handleOpenAdd = useCallback(() => {
    resetForm();
    setOpen(true);
  }, [resetForm]);

  const handleSubmit = useCallback(async () => {
    const normalizedUsername = username.trim();
    const normalizedMessage = message.trim();
    const normalizedEmail = email.trim();
    const normalizedPhoneNumbers = phoneNumbers
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!normalizedUsername || !normalizedMessage) {
      setSubmitErrorMsg("Username and message are required.");
      return;
    }

    setSubmitErrorMsg("");
    setIsSubmitting(true);

    try {
      const result = await createUser({
        name: normalizedUsername,
        email: normalizedEmail,
        message: normalizedMessage,
        phoneNumbers: normalizedPhoneNumbers,
      });

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      if (result.user) {
        setRows((currentRows) => [mapSupporterRow(result.user), ...currentRows]);
      }
      handleClose();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to create user."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [email, handleClose, message, phoneNumbers, username]);

  const handleDelete = useCallback(async (user: SupporterRecord) => {
    const shouldDelete = window.confirm(`Delete user "${user.username}"?`);
    if (!shouldDelete) {
      return;
    }

    const result = await deleteUser(user._id);
    if (!result.ok) {
      setErrorMsg(result.message);
      return;
    }

    setRows((currentRows) => currentRows.filter((row) => row._id !== user._id));
  }, []);

  const handleExportCsv = useCallback(() => {
    const header = [
      "Username",
      "Email",
      "Phone Numbers",
      "Message",
      "Created At",
      "Updated At",
    ];
    const lines = rows.map((row) =>
      [
        row.username,
        row.email,
        row.phoneNumbers.join(" | "),
        row.message,
        row.createdAt,
        row.updatedAt,
      ]
        .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
        .join(",")
    );
    const csvContent = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }, [rows]);

  const isAddDisabled = useMemo(() => {
    return (
      isSubmitting ||
      !username.trim() ||
      !email.trim() ||
      !phoneNumbers.trim() ||
      !message.trim()
    );
  }, [email, isSubmitting, message, phoneNumbers, username]);

  const columns: GridColDef<SupporterRecord>[] = useMemo(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack
            direction="row"
            sx={{
              gap: 1,
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleOpenUserModal(params.row)}
            >
              <ReadOutlinedIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row)}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Stack>
        ),
      },
      { field: "username", headerName: "Username", width: 150 },
      { field: "email", headerName: "Email", width: 220 },
      {
        field: "phoneNumbers",
        headerName: "Phone Numbers",
        width: 220,
        renderCell: (params) =>
          Array.isArray(params.row.phoneNumbers)
            ? params.row.phoneNumbers.join(", ")
            : "",
      },
      { field: "message", headerName: "Message", width: 220 },
      { field: "createdAt", headerName: "Created At", width: 150 },
      { field: "updatedAt", headerName: "Updated At", width: 150 },
    ],
    [handleDelete, handleOpenUserModal]
  );

  return {
    columns,
    email,
    errorMsg,
    handleClose,
    handleDelete,
    handleExportCsv,
    handleOpenAdd,
    handleOpenUserModal,
    handleSubmit,
    isAddDisabled,
    isSubmitting,
    loading,
    message,
    modalMode,
    open,
    phoneNumbers,
    rows,
    selectedUserId,
    setEmail,
    setMessage,
    setPhoneNumbers,
    setUsername,
    submitErrorMsg,
    username,
  };
};
