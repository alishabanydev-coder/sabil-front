import { handleExpiredAdminSession } from "./adminSession";

import { getApiBase, getPublicAssetBase } from "@/lib/apiBase";

const API_BASE = getApiBase();

function normalizeAvatarUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  return value.startsWith("/uploads/")
    ? `${getPublicAssetBase()}${value}`
    : value;
}

function normalizeDonationPageComment(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  return {
    ...item,
    _id: typeof item._id === "string" ? item._id : String(item._id ?? ""),
    avatar: normalizeAvatarUrl(item.avatar),
  };
}

function normalizeDonationPageComments(items) {
  return (Array.isArray(items) ? items : [])
    .map(normalizeDonationPageComment)
    .filter(Boolean);
}

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

function toQuery(params = {}) {
  const search = new URLSearchParams();

  if (typeof params.targetType === "string" && params.targetType.trim()) {
    search.set("targetType", params.targetType.trim());
  }

  if (typeof params.targetId === "string" && params.targetId.trim()) {
    search.set("targetId", params.targetId.trim());
  }

  if (typeof params.username === "string" && params.username.trim()) {
    search.set("username", params.username.trim());
  }

  if (params.limit !== undefined && params.limit !== null && params.limit !== "") {
    search.set("limit", String(params.limit));
  }

  if (typeof params.cursor === "string" && params.cursor.trim()) {
    search.set("cursor", params.cursor.trim());
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function fetchComments(params = {}, { signal } = {}) {
  const response = await fetch(
    `${API_BASE}/api/admin/comments${toQuery(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      comments: [],
      message: data?.message || "Failed to load comments.",
      status: response.status,
    };
  }

  return {
    ok: true,
    comments: Array.isArray(data?.comments) ? data.comments : [],
    message: "",
    status: response.status,
  };
}

export async function fetchCommentThread(
  { targetType, targetId, limit = 10, cursor },
  { signal } = {}
) {
  const response = await fetch(
    `${API_BASE}/api/admin/comments/thread${toQuery({
      targetType,
      targetId,
      limit,
      cursor,
    })}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      targetType: "",
      targetId: null,
      thread: [],
      hasMore: false,
      nextCursor: null,
      message: data?.message || "Failed to load comment thread.",
      status: response.status,
    };
  }

  return {
    ok: true,
    targetType: data?.targetType || targetType || "",
    targetId: data?.targetId ?? targetId ?? null,
    thread: Array.isArray(data?.thread) ? data.thread : [],
    hasMore: Boolean(data?.hasMore),
    nextCursor:
      typeof data?.nextCursor === "string" && data.nextCursor.trim()
        ? data.nextCursor
        : null,
    message: "",
    status: response.status,
  };
}

export async function createComment(body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/comments`, {
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
      comment: null,
      message: data?.message || "Failed to create comment.",
      status: response.status,
    };
  }

  return {
    ok: true,
    comment: data?.comment ?? null,
    message: "",
    status: response.status,
  };
}

export async function updateComment(id, body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/comments/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(body),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      comment: null,
      message: data?.message || "Failed to update comment.",
      status: response.status,
    };
  }

  return {
    ok: true,
    comment: data?.comment ?? null,
    message: "",
    status: response.status,
  };
}

export async function fetchDonationPageComments({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/comments/donation-page`, {
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
      message: data?.message || "Failed to load donation page comments.",
      status: response.status,
    };
  }

  return {
    ok: true,
    items: normalizeDonationPageComments(data?.items),
    message: "",
    status: response.status,
  };
}

export async function updateDonationPageComments(orderedIds, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/comments/donation-page`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      orderedIds: Array.isArray(orderedIds) ? orderedIds : [],
    }),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      items: [],
      message: data?.message || "Failed to save donation page comments.",
      status: response.status,
    };
  }

  return {
    ok: true,
    items: normalizeDonationPageComments(data?.items),
    message: "",
    status: response.status,
  };
}

export async function updateDonationPageComment(id, body, { signal } = {}) {
  const response = await fetch(
    `${API_BASE}/api/admin/comments/${id}/donation-page`,
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
      message: data?.message || "Failed to update donation page comment.",
      status: response.status,
    };
  }

  return {
    ok: true,
    item: normalizeDonationPageComment(data?.item),
    message: "",
    status: response.status,
  };
}

export async function deleteComment(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/comments/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      message: data?.message || "Failed to delete comment.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "",
    status: response.status,
  };
}
