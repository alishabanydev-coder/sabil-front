import { handleExpiredAdminSession } from "./adminSession";

import { getApiBase, getPublicAssetBase } from "@/lib/apiBase";

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

function normalizeBanner(banner) {
  if (!banner || typeof banner !== "object") {
    return null;
  }

  const poster =
    typeof banner.poster === "string" && banner.poster.startsWith("/")
      ? `${getPublicAssetBase()}${banner.poster}`
      : banner.poster;

  return {
    ...banner,
    poster,
  };
}

export async function fetchBanners({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/banner`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      banners: [],
      message: data?.message || "Failed to load banners.",
      status: response.status,
    };
  }

  return {
    ok: true,
    banners: Array.isArray(data?.banners)
      ? data.banners.map((banner) => normalizeBanner(banner)).filter(Boolean)
      : [],
    message: "",
    status: response.status,
  };
}

export async function uploadBanner(body, { signal } = {}) {
  const formData = new FormData();

  Object.entries(body || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE}/api/admin/banner`, {
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
      banner: null,
      message: data?.message || "Failed to upload banner.",
      status: response.status,
    };
  }

  return {
    ok: true,
    banner: normalizeBanner(data?.banner),
    message: "",
    status: response.status,
  };
}

export async function deleteBanner({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/banner`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      message: data?.message || "Failed to delete banner.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "Banner deleted.",
    status: response.status,
  };
}

export async function deleteBannerById(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/banner/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      message: data?.message || "Failed to delete banner.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "Banner deleted.",
    status: response.status,
  };
}
