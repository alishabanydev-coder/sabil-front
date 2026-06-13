import { handleExpiredAdminSession } from "./adminSession";

import { getApiBase } from "@/lib/apiBase";

const API_BASE = getApiBase();

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

async function revalidateHomePage() {
  try {
    const response = await fetch("/api/revalidate-home", {
      method: "POST",
    });
    if (!response.ok) {
      console.error("Failed to revalidate home page cache.", response.status);
    }
  } catch {
    console.error("Failed to revalidate home page cache.");
  }
}

export async function fetchDonation({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/donation`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      donation: null,
      message: data?.message || "Failed to load donation settings.",
      status: response.status,
    };
  }

  return {
    ok: true,
    donation: data?.donation ?? null,
    message: "",
    status: response.status,
  };
}

export async function updateDonation(body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/donation`, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: JSON.stringify(body || {}),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      donation: null,
      message: data?.message || "Failed to update donation settings.",
      status: response.status,
    };
  }

  await revalidateHomePage();

  return {
    ok: true,
    donation: data?.donation ?? null,
    message: "",
    status: response.status,
  };
}

export async function fetchPublicDonation({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/public/donation`, {
    method: "GET",
    cache: "force-cache",
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      donation: null,
      message: data?.message || "Failed to load donation settings.",
      status: response.status,
    };
  }

  return {
    ok: true,
    donation: data?.donation ?? null,
    message: "",
    status: response.status,
  };
}
