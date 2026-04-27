"use client";

import {
  Button,
  Checkbox,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { createAdmin, fetchAdmins } from "../services/adminsApi";

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

const adminInputFont = {
  fontFamily:
    'system-ui, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  textTransform: "none" as const,
};

/** Theme display fonts (e.g. Namecat) show Latin as all caps; keep Namecat on labels, system UI in inputs. */
const adminTextFieldInputSx = (inputFontSize: number) => ({
  direction: "ltr" as const,
  minWidth: 0,
  "& .MuiInputBase-input": { ...adminInputFont, fontSize: inputFontSize },
  "& .MuiSelect-select": { ...adminInputFont, fontSize: inputFontSize },
});

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
  };

  const handleAddAdmin = () => {
    setFormSuccess("");
    setFormError("");
    reset();
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    reset();
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
    if (!u || !adminPassword) {
      setFormError("Username and password are required.");
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
    const result = await createAdmin({
      userName: u,
      name: u,
      password: adminPassword,
      role: adminRole,
      ...(adminRole === "admin" && permissions ? { permissions } : {}),
    });
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    setFormSuccess("Created successfully.");
    setIsFormOpen(false);
    reset();
    await loadAdmins();
  };

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
            <Typography
              sx={{ fontFamily: "Namecat", fontSize: 16, fontWeight: 700 }}
            >
              Admins name:
            </Typography>
            <TextField
              inputRef={firstFieldRef}
              variant="standard"
              value={userName}
              disabled={disabled}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={disabled ? "" : "username"}
              sx={{ ...adminTextFieldInputSx(16), minWidth: 160 }}
              slotProps={{
                htmlInput: { autoCapitalize: "off", spellCheck: false },
              }}
            />
          </Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography
              sx={{ fontFamily: "Namecat", fontSize: 16, fontWeight: 700 }}
            >
              Admins password:
            </Typography>
            <TextField
              type="password"
              variant="standard"
              placeholder={disabled ? "" : "123"}
              value={adminPassword}
              disabled={disabled}
              onChange={(e) => setAdminPassword(e.target.value)}
              sx={adminTextFieldInputSx(16)}
              slotProps={{
                htmlInput: { autoCapitalize: "off", spellCheck: false },
              }}
            />
          </Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography
              sx={{ fontFamily: "Namecat", fontSize: 16, fontWeight: 700 }}
            >
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
              sx={{ ...adminTextFieldInputSx(16), minWidth: 140 }}
            >
              <MenuItem value="admin">admin</MenuItem>
              <MenuItem value="super_admin">super_admin</MenuItem>
            </TextField>
          </Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography
              sx={{ fontFamily: "Namecat", fontSize: 16, fontWeight: 700 }}
            >
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
              sx={adminTextFieldInputSx(16)}
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
                {submitting ? "…" : "Create admin"}
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
            <Paper
              key={admin._id || admin.id || admin.userName}
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                p: 1.5,
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>
                {admin.name || admin.userName}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                {admin.userName} - {admin.role}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                {(admin.permissions || [])
                  .map((permission) => permission.tab)
                  .filter(Boolean)
                  .join(", ") || "Full access"}
              </Typography>
            </Paper>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default Admins;
