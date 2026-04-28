"use client";

import {
  alpha,
  Button,
  Checkbox,
  Chip,
  IconButton,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createAdmin,
  deleteAdmin,
  fetchAdmins,
  updateAdmin,
} from "../services/adminsApi";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

const PERMISSION_TAB_KEYS = [
  "mainPageLayout",
  "banner",
  "breakdowns",
  "blog",
  "comments",
  "projects",
  "users",
  "socialMedia",
] as const;

type PermissionTabKey = (typeof PERMISSION_TAB_KEYS)[number];

const PERMISSION_TAB_LABELS: Record<PermissionTabKey, string> = {
  mainPageLayout: "Main Page Layout",
  banner: "Banner",
  breakdowns: "Breakdowns",
  blog: "Blog",
  comments: "Comments",
  projects: "Projects",
  users: "Users",
  socialMedia: "Social Media",
};

type AdminRecord = {
  _id?: string;
  id?: string;
  userName?: string;
  name?: string;
  role?: string;
  permissions?: Array<{ tab?: string }>;
};

const Admins = () => {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRole, setAdminRole] = useState<"admin" | "super_admin">("admin");
  const [adminPermissions, setAdminPermissions] = useState<PermissionTabKey[]>(
    []
  );
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState("");
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  const loadAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    const result = await fetchAdmins();
    setLoadingAdmins(false);

    if (result.ok) {
      setAdmins(result.admins);
    }
  }, []);

  useEffect(() => {
    if (!isFormOpen) {
      return;
    }
    const id = requestAnimationFrame(() => {
      firstFieldRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isFormOpen]);

  const reset = () => {
    setUserName("");
    setAdminPassword("");
    setAdminRole("admin");
    setAdminPermissions([]);
    setFormError("");
    setIsEditing(false);
    setEditingAdminId("");
  };

  const handleAddAdmin = () => {
    setFormSuccess("");
    setFormError("");
    reset();
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    reset();
  };

  const handleEditAdmin = (admin: AdminRecord) => {
    const nextRole =
      admin.role === "super_admin"
        ? ("super_admin" as const)
        : ("admin" as const);
    const nextPermissions: PermissionTabKey[] = (admin.permissions || [])
      .map((permission) => permission.tab)
      .filter(
        (tab): tab is PermissionTabKey =>
          Boolean(tab) &&
          (PERMISSION_TAB_KEYS as readonly string[]).includes(tab as string)
      );

    setFormError("");
    setFormSuccess("");
    setEditingAdminId(admin._id || admin.id || "");
    setUserName(admin.userName || "");
    setAdminPassword("");
    setAdminRole(nextRole);
    setAdminPermissions(nextPermissions);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleCreate = async () => {
    if (submitting) {
      return;
    }

    setFormError("");
    setFormSuccess("");

    if (!isFormOpen) {
      return;
    }

    const u = userName.trim();
    if (!u || (!isEditing && !adminPassword)) {
      setFormError(
        isEditing
          ? "Username is required."
          : "Username and password are required."
      );
      return;
    }

    if (adminRole === "admin") {
      if (adminPermissions.length === 0) {
        setFormError(
          "For role admin, select at least one tab for full CRUD access."
        );
        return;
      }
    }

    const permissions =
      adminRole === "admin"
        ? adminPermissions.map((tab) => ({
            tab,
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
            projectIds: [],
          }))
        : undefined;

    setSubmitting(true);
    const payload = {
      userName: u,
      name: u,
      role: adminRole,
      ...(adminPassword ? { password: adminPassword } : {}),
      ...(adminRole === "admin" && permissions ? { permissions } : {}),
    };
    const result =
      isEditing && editingAdminId
        ? await updateAdmin(editingAdminId, payload)
        : await createAdmin({ ...payload, password: adminPassword });
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    setFormSuccess(
      isEditing ? "Updated successfully." : "Created successfully."
    );
    setIsFormOpen(false);
    reset();
    // await loadAdmins();
  };

  const handleDeleteAdmin = async (admin: AdminRecord) => {
    const id = admin._id || admin.id;
    if (!id) {
      setFormError("Admin id is missing.");
      return;
    }

    const ok = window.confirm(
      `Delete admin "${admin.userName || admin.name || id}"?`
    );
    if (!ok) {
      return;
    }

    setFormError("");
    setFormSuccess("");
    const result = await deleteAdmin(id);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    setAdmins((prev) => prev.filter((item) => (item._id || item.id) !== id));
    setFormSuccess("Deleted successfully.");
    if (editingAdminId === id) {
      setIsFormOpen(false);
      reset();
    }
  };

  useEffect(() => {
    loadAdmins();
  }, [formSuccess]);

  const disabled = !isFormOpen;

  return (
    <Stack direction="row" sx={{ gap: 2 }}>
      <Stack sx={{ height: "100%", width: "40%", gap: 2 }}>
        <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
          Admins
        </Typography>
        <Typography component="p" sx={{ color: "text.secondary", mt: 1 }}>
          This section you see admins and their permissions
        </Typography>

        <Button
          variant="contained"
          color="primary"
          disabled={isFormOpen}
          onClick={handleAddAdmin}
        >
          Add Admin
        </Button>

        {formError ? (
          <Typography color="error" variant="body2" sx={{ mt: 0.5 }}>
            {formError}
          </Typography>
        ) : null}
        {formSuccess ? (
          <Typography color="success.main" variant="body2" sx={{ mt: 0.5 }}>
            {formSuccess}
          </Typography>
        ) : null}

        <Stack
          sx={{
            border: (theme) => `1px solid ${theme.palette.primary.dark}`,
            borderRadius: 2,
            p: 2,
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
              Admins name:
            </Typography>
            <TextField
              inputRef={firstFieldRef}
              variant="standard"
              value={userName}
              disabled={disabled}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={disabled ? "" : "username"}
              slotProps={{
                htmlInput: { autoCapitalize: "off", spellCheck: false },
              }}
            />
          </Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
              Admins password:
            </Typography>
            <TextField
              type="password"
              variant="standard"
              placeholder={disabled ? "" : "123"}
              value={adminPassword}
              disabled={disabled}
              onChange={(e) => setAdminPassword(e.target.value)}
              slotProps={{
                htmlInput: { autoCapitalize: "off", spellCheck: false },
              }}
            />
          </Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
              Admins role:
            </Typography>
            <TextField
              select
              variant="standard"
              value={adminRole}
              disabled={disabled}
              onChange={(e) =>
                setAdminRole(e.target.value as "admin" | "super_admin")
              }
            >
              <MenuItem value="admin">admin</MenuItem>
              <MenuItem value="super_admin">super_admin</MenuItem>
            </TextField>
          </Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
              Admins permissions:
            </Typography>
            <TextField
              variant="standard"
              select
              value={adminPermissions}
              disabled={disabled}
              onChange={(e) =>
                setAdminPermissions(
                  e.target.value as unknown as PermissionTabKey[]
                )
              }
              slotProps={{
                select: {
                  multiple: true,
                  renderValue: (selected) =>
                    (selected as PermissionTabKey[])
                      .map((tab) => PERMISSION_TAB_LABELS[tab])
                      .join(", "),
                },
              }}
              helperText={
                adminRole === "admin"
                  ? "Selected tabs get full CRUD access."
                  : "Super admins automatically get all permissions."
              }
            >
              {PERMISSION_TAB_KEYS.map((tab) => (
                <MenuItem key={tab} value={tab}>
                  <Checkbox checked={adminPermissions.includes(tab)} />
                  <ListItemText primary={PERMISSION_TAB_LABELS[tab]} />
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          {isFormOpen && (
            <Stack
              direction="row"
              sx={{ justifyContent: "flex-end", gap: 1, mt: 1 }}
            >
              <Button
                type="button"
                color="inherit"
                size="small"
                disabled={submitting}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="contained"
                size="small"
                disabled={submitting}
                onClick={handleCreate}
              >
                {submitting ? "…" : isEditing ? "Edit Admin" : "Create admin"}
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>

      <Stack
        sx={{
          height: "100%",
          width: "60%",
          gap: 1,
          px: 2,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
          borderRadius: 2,
          p: 2,
        }}
      >
        {loadingAdmins ? (
          <Typography color="text.secondary">Loading admins...</Typography>
        ) : admins.length === 0 ? (
          <Typography color="text.secondary">No admins loaded yet.</Typography>
        ) : (
          admins.map((admin) => (
            <Stack
              key={admin._id || admin.id || admin.userName}
              sx={{
                width: "100%",
                textAlign: "left",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                p: 1.5,
                borderRadius: 4,
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <Stack sx={{ width: "100%" }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textTransform: "none",
                      color: "text.primary",
                    }}
                  >
                    {admin.name || admin.userName}
                  </Typography>

                  <Stack direction="row" sx={{ gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAdmin(admin)}
                      sx={{
                        color: "error.main",
                        bgcolor: (theme) =>
                          alpha(theme.palette.error.main, 0.3),
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.error.main, 0.4),
                        },
                      }}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditAdmin(admin)}
                      sx={{
                        color: "secondary.main",
                        bgcolor: (theme) =>
                          alpha(theme.palette.secondary.main, 0.4),
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.secondary.main, 0.5),
                        },
                      }}
                    >
                      <ModeEditOutlineOutlinedIcon />
                    </IconButton>
                    <Chip
                      label={admin.role}
                      variant="filled"
                      sx={{
                        color: "#fff",
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.5),
                      }}
                    />
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  sx={{ gap: 0.75, flexWrap: "wrap", mt: 0.5 }}
                >
                  {(admin.permissions || []).filter(
                    (permission) => permission.tab
                  ).length === 0 ? (
                    <Chip size="small" label="Full access" variant="outlined" />
                  ) : (
                    (admin.permissions || [])
                      .map((permission) => permission.tab)
                      .filter(Boolean)
                      .map((tab) => (
                        <Chip
                          key={`${admin._id || admin.id || admin.userName}-${tab}`}
                          size="small"
                          label={
                            PERMISSION_TAB_LABELS[tab as PermissionTabKey] ||
                            tab
                          }
                          variant="outlined"
                          color="primary"
                        />
                      ))
                  )}
                </Stack>
              </Stack>
              <Stack></Stack>
            </Stack>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default Admins;
