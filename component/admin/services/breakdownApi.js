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

export async function fetchBreakdowns({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/breakdowns`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      breakdowns: [],
      message: data?.message || "Failed to load breakdowns.",
      status: response.status,
    };
  }

  return {
    ok: true,
    breakdowns: Array.isArray(data?.breakdowns) ? data.breakdowns : [],
    message: "",
    status: response.status,
  };
}

export async function createBreakdown(body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/breakdowns`, {
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
      breakdown: null,
      message: data?.message || "Failed to create breakdown.",
      status: response.status,
    };
  }

  return {
    ok: true,
    breakdown: data?.breakdown ?? null,
    message: "",
    status: response.status,
  };
}
