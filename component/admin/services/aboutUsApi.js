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
    await fetch("/api/revalidate-home", {
      method: "POST",
    });
  } catch {
    // Keep admin updates successful even if cache invalidation fails.
  }
}

export async function fetchAboutUs({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/about-us`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      aboutUs: null,
      message: data?.message || "Failed to load About Us content.",
      status: response.status,
    };
  }

  return {
    ok: true,
    aboutUs: data?.aboutUs ?? null,
    message: "",
    status: response.status,
  };
}

export async function updateAboutUs(body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/about-us`, {
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
      aboutUs: null,
      message: data?.message || "Failed to update About Us content.",
      status: response.status,
    };
  }

  await revalidateHomePage();

  return {
    ok: true,
    aboutUs: data?.aboutUs ?? null,
    message: "",
    status: response.status,
  };
}

export async function fetchPublicAboutUs({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/public/about-us`, {
    method: "GET",
    cache: "force-cache",
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      aboutUs: null,
      message: data?.message || "Failed to load About Us content.",
      status: response.status,
    };
  }

  return {
    ok: true,
    aboutUs: data?.aboutUs ?? null,
    message: "",
    status: response.status,
  };
}
