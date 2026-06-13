import { handleExpiredAdminSession } from "./adminSession";

import { getApiBase } from "@/lib/apiBase";

const API_BASE = getApiBase();

function normalizeAssetUrl(value) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return value;
  }

  return `${API_BASE}${value}`;
}

function getAuthHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
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

function normalizeSocialMediaLink(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  return {
    ...item,
    icon: normalizeAssetUrl(item.icon),
  };
}

export async function fetchSocialMediaLinks({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/social-media`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      socialMediaLinks: [],
      message: data?.message || "Failed to load social media links.",
      status: response.status,
    };
  }

  return {
    ok: true,
    socialMediaLinks: Array.isArray(data?.socialMediaLinks)
      ? data.socialMediaLinks
          .map(normalizeSocialMediaLink)
          .filter((item) => item !== null)
      : [],
    message: "",
    status: response.status,
  };
}

export async function fetchPublicSocialMediaLinks({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/public/social-media`, {
    method: "GET",
    cache: "force-cache",
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      socialMediaLinks: [],
      message: data?.message || "Failed to load social media links.",
      status: response.status,
    };
  }

  return {
    ok: true,
    socialMediaLinks: Array.isArray(data?.socialMediaLinks)
      ? data.socialMediaLinks
          .map(normalizeSocialMediaLink)
          .filter((item) => item !== null)
      : [],
    message: "",
    status: response.status,
  };
}

export async function createSocialMediaLink(body, { signal } = {}) {
  const formData = new FormData();
  formData.append("name", body?.name || "");
  formData.append("url", body?.url || "");
  if (body?.icon) {
    formData.append("icon", body.icon);
  }

  const response = await fetch(`${API_BASE}/api/admin/social-media`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      socialMediaLink: null,
      message: data?.message || "Failed to create social media link.",
      status: response.status,
    };
  }

  return {
    ok: true,
    socialMediaLink: normalizeSocialMediaLink(data?.socialMediaLink),
    message: "",
    status: response.status,
  };
}

export async function updateSocialMediaLink(id, body, { signal } = {}) {
  const formData = new FormData();
  formData.append("name", body?.name || "");
  formData.append("url", body?.url || "");
  if (body?.icon) {
    formData.append("icon", body.icon);
  }

  const response = await fetch(`${API_BASE}/api/admin/social-media/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      socialMediaLink: null,
      message: data?.message || "Failed to update social media link.",
      status: response.status,
    };
  }

  return {
    ok: true,
    socialMediaLink: normalizeSocialMediaLink(data?.socialMediaLink),
    message: "",
    status: response.status,
  };
}

export async function deleteSocialMediaLink(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/social-media/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      message: data?.message || "Failed to delete social media link.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "",
    status: response.status,
  };
}
