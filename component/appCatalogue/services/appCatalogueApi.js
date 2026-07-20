import { getApiBase, getPublicAssetBase } from "@/lib/apiBase";

const API_BASE = getApiBase();

function normalizeAssetUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/uploads/")) {
    return `${getPublicAssetBase()}${value}`;
  }

  if (value.startsWith("/")) {
    return value;
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
          projectId:
            typeof data.video.projectId === "string"
              ? data.video.projectId
              : data.video.projectId?.toString?.() || "",
        }
      : null,
    project: data?.project
      ? {
          ...data.project,
          _id:
            typeof data.project._id === "string"
              ? data.project._id
              : data.project._id?.toString?.() || "",
          thumbnail: normalizeAssetUrl(data.project.thumbnail),
        }
      : null,
    message: "",
    status: response.status,
  };
}

export async function fetchPublicProjectPreviews() {
  const response = await fetch(
    `${API_BASE}/api/admin/public/app-catalogue/navigation-buttons`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const data = await readJson(response);
  /** @type {Record<string, { name: string; logo: string }>} */
  const previews = {};
  const buttons = Array.isArray(data?.buttons) ? data.buttons : [];

  buttons.forEach((button) => {
    if (button?.type !== "project" || !button?.projectId) {
      return;
    }

    previews[String(button.projectId)] = {
      name: typeof button.title === "string" ? button.title : "",
      logo: normalizeAssetUrl(button.image),
    };
  });

  return previews;
}

export async function fetchPublicAllVideos({ showInHomepageOnly = false } = {}) {
  const query = showInHomepageOnly ? "?showInHomepage=true" : "";
  const response = await fetch(`${API_BASE}/api/admin/public/videos${query}`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      videos: [],
      message: data?.message || "Failed to load videos.",
      status: response.status,
    };
  }

  const rawVideos = Array.isArray(data?.videos) ? data.videos : [];
  return {
    ok: true,
    videos: rawVideos.map((video) => ({
      ...video,
      _id: typeof video._id === "string" ? video._id : video._id?.toString?.() || "",
      projectId:
        typeof video.projectId === "string"
          ? video.projectId
          : video.projectId?.toString?.() || "",
      thumbnail: normalizeAssetUrl(video.thumbnail),
      projectThumbnail: normalizeAssetUrl(video.projectThumbnail),
      projectTitle: typeof video.projectTitle === "string" ? video.projectTitle : "",
    })),
    message: "",
    status: response.status,
  };
}
