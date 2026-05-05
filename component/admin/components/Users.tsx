import {
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, fetchUsers } from "../services/usersApi";
import ReadOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

type UserRecord = {
  id: string;
  _id: string;
  username: string;
  message: string;
  phoneNumbers: string[];
  email: string;
  createdAt: string;
  updatedAt: string;
};

const style = {
  direction: "ltr",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 2,
  borderRadius: 2,
};

const Users = () => {
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [rows, setRows] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSelectedUserId(null);
    setModalMode("add");
    setUsername("");
    setEmail("");
    setMessage("");
    setPhoneNumbers("");
    setSubmitErrorMsg("");
  };

  const mapUserRow = (user: any): UserRecord => ({
    id: user._id,
    _id: user._id,
    username: user.name || "",
    message: user.message || "",
    phoneNumbers: Array.isArray(user.phoneNumbers) ? user.phoneNumbers : [],
    email: user.email || "",
    createdAt: user.createdAt || "",
    updatedAt: user.updatedAt || "",
  });

  const loadUsers = async (signal?: AbortSignal) => {
    setLoading(true);
    setErrorMsg("");
    const result = await fetchUsers({ signal });
    if (!result.ok) {
      setLoading(false);
      setErrorMsg(result.message);
      return;
    }

    setRows(result.users.map(mapUserRow));
    setLoading(false);
  };

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
  }, []);

  const handleOpenUserModal = (user: UserRecord) => {
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
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleOpenAdd = () => {
    setOpen(true);
    resetForm();
  };

  const handleSubmit = async () => {
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
        setRows((currentRows) => [mapUserRow(result.user), ...currentRows]);
      }
      handleClose();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to create user."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user: UserRecord) => {
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
  };

  const handleExportCsv = () => {
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
  };

  const columns: GridColDef<UserRecord>[] = useMemo(
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
    []
  );

  return (
    <Stack>
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
        <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
          Users
        </Typography>

        <Stack direction="row" sx={{ gap: 1 }}>
          <Button variant="outlined" onClick={handleExportCsv}>
            Export Excel (CSV)
          </Button>
          <Button variant="contained" onClick={handleOpenAdd}>
            Add User
          </Button>
        </Stack>
      </Stack>
      {errorMsg ? (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {errorMsg}
        </Typography>
      ) : null}
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
      />

      <Modal open={open} onClose={handleClose}>
        <Stack sx={style}>
          <Stack sx={{ width: "100%", gap: 2 }}>
            <Typography variant="h6">
              {modalMode === "edit" ? "Edit User" : "Add User"}
            </Typography>

            <TextField
              label="Username"
              variant="standard"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={modalMode === "edit"}
              fullWidth
            />
            <TextField
              label="Email"
              variant="standard"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={modalMode === "edit"}
              fullWidth
            />

            <TextField
              label="Phone Numbers"
              variant="standard"
              type="tel"
              value={phoneNumbers}
              onChange={(event) =>
                setPhoneNumbers(event.target.value.replace(/[^\d,]/g, ""))
              }
              disabled={modalMode === "edit"}
              helperText="Use digits only. For multiple numbers, separate with comma."
              fullWidth
            />
            <TextField
              label="Message"
              multiline
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={modalMode === "edit"}
              fullWidth
            />
            <Stack direction="row" sx={{ gap: 2 }}>
              {modalMode === "add" ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !username.trim() ||
                    !email.trim() ||
                    !phoneNumbers.trim() ||
                    !message.trim()
                  }
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </Button>
              ) : null}
              <Button variant="outlined" color="primary" onClick={handleClose}>
                {modalMode === "edit" ? "Close" : "Cancel"}
              </Button>
            </Stack>
            {selectedUserId ? (
              <Typography variant="caption" color="text.secondary">
                User ID: {selectedUserId}
              </Typography>
            ) : null}
            {submitErrorMsg ? (
              <Typography color="error" variant="body2">
                {submitErrorMsg}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default Users;
