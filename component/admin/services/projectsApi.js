import { handleExpiredAdminSession } from "./adminSession";

const API_BASE =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_ADMIN_API_URL) ||
  "http://localhost:5000";

function getAuthHeaders(json = false) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchProjects({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/projects`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      projects: [],
      message: data?.message || "Failed to load projects.",
      status: response.status,
    };
  }

  return {
    ok: true,
    projects: Array.isArray(data?.projects) ? data.projects : [],
    message: "",
    status: response.status,
  };
}

export async function createProject(body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/projects`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(body),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      project: null,
      message: data?.message || "Failed to create project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    project: data?.project ?? null,
    message: "",
    status: response.status,
  };
}

export async function updateProject(id, body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: JSON.stringify(body),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      project: null,
      message: data?.message || "Failed to update project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    project: data?.project ?? null,
    message: "",
    status: response.status,
  };
}

export async function deleteProject(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      message: data?.message || "Failed to delete project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "Project deleted.",
    status: response.status,
  };
}
