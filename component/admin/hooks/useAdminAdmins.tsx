import type {
  AdminAccountRecord,
  AdminPermissionTabKey,
  AdminProjectRecord,
} from "@/types/admin";
import {
  ADMIN_PERMISSION_TAB_KEYS,
  ADMIN_PERMISSION_TAB_LABELS,
} from "@/types/admin";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createAdmin,
  deleteAdmin,
  fetchAdmins,
  updateAdmin,
} from "../services/adminsApi";
import { fetchProjects } from "../services/projectsApi";
import {
  notifyAdminError,
  notifyAdminSuccess,
} from "../snackbar/notifyAdmin";

function getRecordId(record: { _id?: string; id?: string } | string) {
  return typeof record === "string" ? record : record._id || record.id || "";
}

function getProjectName(projects: AdminProjectRecord[], projectId: string) {
  return projects.find((project) => getRecordId(project) === projectId)?.name;
}

function hasProject(projects: AdminProjectRecord[], projectId: string) {
  return projects.some((project) => getRecordId(project) === projectId);
}

export const useAdminAdmins = () => {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRole, setAdminRole] = useState<"admin" | "super_admin">("admin");
  const [adminPermissions, setAdminPermissions] = useState<
    AdminPermissionTabKey[]
  >([]);
  const [adminProjectIds, setAdminProjectIds] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState("");
  const [admins, setAdmins] = useState<AdminAccountRecord[]>([]);
  const [projects, setProjects] = useState<AdminProjectRecord[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [open, setOpen] = useState(false);

  const reset = useCallback(() => {
    setUserName("");
    setAdminPassword("");
    setAdminRole("admin");
    setAdminPermissions([]);
    setAdminProjectIds([]);
    setFormError("");
    setIsEditing(false);
    setEditingAdminId("");
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setIsFormOpen(false);
    reset();
  }, [reset]);

  const loadAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    const result = await fetchAdmins();
    setLoadingAdmins(false);

    if (result.ok) {
      setAdmins(result.admins);
      return;
    }

    notifyAdminError(result.message || "Failed to load admins.");
  }, []);

  const loadProjects = useCallback(async () => {
    const result = await fetchProjects();

    if (result.ok) {
      setProjects(result.projects);
      return;
    }

    notifyAdminError(result.message || "Failed to load projects.");
  }, []);

  const handleAddAdmin = useCallback(() => {
    setOpen(true);
    setFormSuccess("");
    setFormError("");
    reset();
    setIsEditing(false);
    setIsFormOpen(true);
  }, [reset]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    setIsFormOpen(false);
    reset();
  }, [reset]);

  const handleEditAdmin = useCallback(
    (admin: AdminAccountRecord) => {
      const nextRole =
        admin.role === "super_admin"
          ? ("super_admin" as const)
          : ("admin" as const);
      const nextPermissions: AdminPermissionTabKey[] = (admin.permissions || [])
        .map((permission) => permission.tab)
        .filter(
          (tab): tab is AdminPermissionTabKey =>
            Boolean(tab) &&
            (ADMIN_PERMISSION_TAB_KEYS as readonly string[]).includes(
              tab as string
            )
        );
      const nextProjectIds =
        (admin.permissions || [])
          .find((permission) => permission.tab === "channels")
          ?.projectIds?.map(getRecordId)
          .filter(
            (projectId) => projectId && hasProject(projects, projectId)
          ) || [];

      setOpen(true);
      setFormError("");
      setFormSuccess("");
      setEditingAdminId(admin._id || admin.id || "");
      setUserName(admin.userName || "");
      setAdminPassword("");
      setAdminRole(nextRole);
      setAdminPermissions(nextPermissions);
      setAdminProjectIds(nextProjectIds);
      setIsEditing(true);
      setIsFormOpen(true);
    },
    [projects]
  );

  const handleCreate = useCallback(async () => {
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
      const message = isEditing
        ? "Username is required."
        : "Username and password are required.";
      setFormError(message);
      notifyAdminError(message);
      return;
    }

    if (adminRole === "admin") {
      if (adminPermissions.length === 0) {
        const message =
          "For role admin, select at least one tab for full CRUD access.";
        setFormError(message);
        notifyAdminError(message);
        return;
      }

      if (
        adminPermissions.includes("channels") &&
        adminProjectIds.length === 0
      ) {
        const message = "Select at least one project for channel access.";
        setFormError(message);
        notifyAdminError(message);
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
            projectIds: tab === "channels" ? adminProjectIds : [],
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
      notifyAdminError(result.message || "Failed to save admin.");
      return;
    }

    const successMessage = isEditing
      ? "Updated successfully."
      : "Created successfully.";
    setFormSuccess(successMessage);
    notifyAdminSuccess(successMessage);
    setIsFormOpen(false);
    setOpen(false);
    reset();
    // await loadAdmins();
  }, [
    adminPassword,
    adminPermissions,
    adminProjectIds,
    adminRole,
    editingAdminId,
    isEditing,
    isFormOpen,
    reset,
    submitting,
    userName,
  ]);

  const handleDeleteAdmin = useCallback(
    async (admin: AdminAccountRecord) => {
      const id = admin._id || admin.id;
      if (!id) {
        const message = "Admin id is missing.";
        setFormError(message);
        notifyAdminError(message);
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
        notifyAdminError(result.message || "Failed to delete admin.");
        return;
      }

      setAdmins((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setFormSuccess("Deleted successfully.");
      notifyAdminSuccess("Deleted successfully.");
      if (editingAdminId === id) {
        setIsFormOpen(false);
        reset();
      }
    },
    [editingAdminId, reset]
  );

  useEffect(() => {
    if (!isFormOpen) {
      return;
    }
    const id = requestAnimationFrame(() => {
      firstFieldRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isFormOpen]);

  useEffect(() => {
    loadAdmins();
  }, [formSuccess, loadAdmins]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const disabled = !isFormOpen;

  const getPermissionLabel = useCallback(
    (tab: AdminPermissionTabKey, projectIds?: Array<string | AdminProjectRecord>) => {
      const projectNames = (projectIds || [])
        .map(getRecordId)
        .filter(Boolean)
        .map((projectId) => getProjectName(projects, projectId))
        .filter(Boolean);
      return tab === "channels" && projectNames.length > 0
        ? `Channels: ${projectNames.join(", ")}`
        : ADMIN_PERMISSION_TAB_LABELS[tab];
    },
    [projects]
  );

  return {
    adminPassword,
    adminPermissions,
    adminProjectIds,
    adminRole,
    admins,
    disabled,
    editingAdminId,
    firstFieldRef,
    formError,
    formSuccess,
    getPermissionLabel,
    getRecordId,
    handleAddAdmin,
    handleCancel,
    handleClose,
    handleCreate,
    handleDeleteAdmin,
    handleEditAdmin,
    isEditing,
    isFormOpen,
    loadingAdmins,
    open,
    projects,
    setAdminPassword,
    setAdminPermissions,
    setAdminProjectIds,
    setAdminRole,
    setUserName,
    submitting,
    userName,
  };
};

export { getRecordId, getProjectName };
