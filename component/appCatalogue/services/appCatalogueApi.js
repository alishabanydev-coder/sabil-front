const API_BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADMIN_API_URL) ||
  "http://localhost:5000";

function normalizeAssetUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/uploads/")) {
    return `${API_BASE}${value}`;
  }

  return value;
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchPublicVideoById(videoId) {
  const normalizedVideoId = typeof videoId === "string" ? videoId.trim() : "";
  if (!normalizedVideoId) {
    return {
      ok: false,
      video: null,
      project: null,
      message: "Video id is required.",
      status: 400,
    };
  }

  const response = await fetch(
    `${API_BASE}/api/admin/public/videos/${normalizedVideoId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      video: null,
      project: null,
      message: data?.message || "Failed to load video.",
      status: response.status,
    };
  }

  return {
    ok: true,
    video: data?.video
      ? {
          ...data.video,
          thumbnail: normalizeAssetUrl(data.video.thumbnail),
          url: normalizeAssetUrl(data.video.url),
        }
      : null,
    project: data?.project
      ? {
          ...data.project,
          thumbnail: normalizeAssetUrl(data.project.thumbnail),
        }
      : null,
    message: "",
    status: response.status,
  };
}
