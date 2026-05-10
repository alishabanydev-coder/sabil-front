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

function normalizeAssetUrl(value) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return value;
  }

  return `${API_BASE}${value}`;
}

function normalizeSectionItem(section, item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  if (section === "banner") {
    return {
      ...item,
      poster: normalizeAssetUrl(item.poster),
    };
  }

  if (section === "projects" || section === "breakdown" || section === "video") {
    return {
      ...item,
      thumbnail: normalizeAssetUrl(item.thumbnail),
    };
  }

  return item;
}

export async function fetchMainPageLayoutItems(section, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/main-page-layout/${section}`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      items: [],
      message: data?.message || "Failed to load main page layout items.",
      status: response.status,
    };
  }

  const rawItems = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];

  return {
    ok: true,
    items: rawItems
      .map((item) => normalizeSectionItem(section, item))
      .filter(Boolean),
    message: "",
    status: response.status,
  };
}

export async function fetchPublicMainPageLayoutItems(section) {
  const response = await fetch(`${API_BASE}/api/admin/public/main-page-layout/${section}`, {
    method: "GET",
  });
  return await response.json();
}

export async function updateMainPageLayoutItem(section, id, body, { signal } = {}) {
  const response = await fetch(
    `${API_BASE}/api/admin/main-page-layout/${section}/${id}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(true),
      body: JSON.stringify(body || {}),
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      item: null,
      message: data?.message || "Failed to update main page layout item.",
      status: response.status,
    };
  }

  return {
    ok: true,
    item: normalizeSectionItem(section, data?.item),
    message: "",
    status: response.status,
  };
}
