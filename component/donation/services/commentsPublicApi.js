import { getApiBase, getPublicAssetBase } from "@/lib/apiBase";
import { getStoredUserToken } from "@/component/auth/services/userAuthApi";

const API_BASE = getApiBase();

function normalizeAssetUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    (value.startsWith("/") && !value.startsWith("/uploads/"))
  ) {
    return value;
  }

  if (value.startsWith("/uploads/")) {
    return `${getPublicAssetBase()}${value}`;
  }

  return value;
}

function normalizePublicComment(comment) {
  return {
    ...comment,
    _id:
      typeof comment._id === "string"
        ? comment._id
        : String(comment._id ?? ""),
    avatar: normalizeAssetUrl(comment.avatar),
  };
}

/**
 * @param {string} targetType
 * @param {string} targetId
 * @param {{ limit?: number, page?: number }} [options]
 */
export async function fetchPublicComments(
  targetType,
  targetId,
  { limit = 10, page = 1 } = {}
) {
  const params = new URLSearchParams({
    targetType,
    targetId,
    limit: String(limit),
    page: String(page),
  });

  const response = await fetch(
    `${API_BASE}/api/auth/public/comments?${params.toString()}`,
    { method: "GET" }
  );
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      message: data?.message || "Failed to load comments.",
      comments: [],
      page: 1,
      limit,
      totalRoots: 0,
      totalPages: 1,
    };
  }

  const comments = Array.isArray(data?.comments)
    ? data.comments.map((comment) => normalizePublicComment(comment))
    : [];

  return {
    ok: true,
    message: "",
    comments,
    page: Number(data?.page) > 0 ? Number(data.page) : 1,
    limit: Number(data?.limit) > 0 ? Number(data.limit) : limit,
    totalRoots: Number(data?.totalRoots) >= 0 ? Number(data.totalRoots) : 0,
    totalPages: Number(data?.totalPages) > 0 ? Number(data.totalPages) : 1,
  };
}

export async function createPublicComment(body) {
  const token = getStoredUserToken();
  const response = await fetch(`${API_BASE}/api/auth/public/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      message: data?.message || "Failed to post comment.",
      comment: null,
    };
  }

  return {
    ok: true,
    message: "",
    comment: data?.comment ? normalizePublicComment(data.comment) : null,
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
