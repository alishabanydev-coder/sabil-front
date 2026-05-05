import { handleExpiredAdminSession } from "./adminSession";

const API_BASE =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_ADMIN_API_URL) ||
  "http://localhost:5000";

function normalizeAssetUrl(value) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return value;
  }

  return `${API_BASE}${value}`;
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

export async function fetchProjects({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/projects`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      projects: [],
      message: data?.message || "Failed to load projects.",
      status: response.status,
    };
  }

  return {
    ok: true,
    projects: Array.isArray(data?.projects) ? data.projects : [],
    message: "",
    status: response.status,
  };
}

export async function fetchChannelProjects({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/channels/projects`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      projects: [],
      message: data?.message || "Failed to load channel projects.",
      status: response.status,
    };
  }

  return {
    ok: true,
    projects: Array.isArray(data?.projects) ? data.projects : [],
    message: "",
    status: response.status,
  };
}

export async function fetchChannelVideos(projectId, { signal } = {}) {
  const response = await fetch(
    `${API_BASE}/api/admin/channels/projects/${projectId}/videos`,
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
      videos: [],
      message: data?.message || "Failed to load channel videos.",
      status: response.status,
    };
  }

  return {
    ok: true,
    videos: Array.isArray(data?.videos)
      ? data.videos.map((video) => ({
          ...video,
          thumbnail: normalizeAssetUrl(video.thumbnail),
        }))
      : [],
    message: "",
    status: response.status,
  };
}

export async function fetchChannelBreakdowns(projectId, { signal } = {}) {
  const response = await fetch(
    `${API_BASE}/api/admin/channels/projects/${projectId}/breakdowns`,
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
      breakdowns: [],
      message: data?.message || "Failed to load channel breakdowns.",
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

export async function createChannelVideo(projectId, body, { signal } = {}) {
  const formData = new FormData();

  Object.entries(body || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await fetch(
    `${API_BASE}/api/admin/channels/projects/${projectId}/videos`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      video: null,
      message: data?.message || "Failed to create video.",
      status: response.status,
    };
  }

  return {
    ok: true,
    video: data?.video
      ? {
          ...data.video,
          thumbnail: normalizeAssetUrl(data.video.thumbnail),
        }
      : null,
    message: "",
    status: response.status,
  };
}

export async function updateChannelVideo(
  projectId,
  videoId,
  body,
  { signal } = {}
) {
  const formData = new FormData();

  Object.entries(body || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await fetch(
    `${API_BASE}/api/admin/channels/projects/${projectId}/videos/${videoId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: formData,
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      video: null,
      message: data?.message || "Failed to update video.",
      status: response.status,
    };
  }

  return {
    ok: true,
    video: data?.video
      ? {
          ...data.video,
          thumbnail: normalizeAssetUrl(data.video.thumbnail),
        }
      : null,
    message: "",
    status: response.status,
  };
}

export async function deleteChannelVideo(projectId, videoId, { signal } = {}) {
  const response = await fetch(
    `${API_BASE}/api/admin/channels/projects/${projectId}/videos/${videoId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      message: data?.message || "Failed to delete video.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "Video deleted.",
    status: response.status,
  };
}

export async function createProject(body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/projects`, {
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
      project: null,
      message: data?.message || "Failed to create project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    project: data?.project ?? null,
    message: "",
    status: response.status,
  };
}

export async function updateProject(id, body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: JSON.stringify(body),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      project: null,
      message: data?.message || "Failed to update project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    project: data?.project ?? null,
    message: "",
    status: response.status,
  };
}

export async function deleteProject(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      message: data?.message || "Failed to delete project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "Project deleted.",
    status: response.status,
  };
}
