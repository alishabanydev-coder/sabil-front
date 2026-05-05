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

export async function fetchUsers({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/supporters`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      users: [],
      message: data?.message || "Failed to load users.",
      status: response.status,
    };
  }

  return {
    ok: true,
    users: Array.isArray(data?.supporters) ? data.supporters : [],
    message: "",
    status: response.status,
  };
}

export async function createUser(body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/supporters`, {
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
      user: null,
      message: data?.message || "Failed to create user.",
      status: response.status,
    };
  }

  return {
    ok: true,
    user: data?.supporter ?? null,
    message: "",
    status: response.status,
  };
}

export async function deleteUser(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/supporters/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      message: data?.message || "Failed to delete user.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "",
    status: response.status,
  };
}
