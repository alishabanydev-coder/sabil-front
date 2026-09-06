import { handleExpiredAdminSession } from "./adminSession";

import { getApiBase, getPublicAssetBase } from "@/lib/apiBase";

const API_BASE = getApiBase();

function normalizeAssetUrl(value) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return typeof value === "string" && value.startsWith("data:") ? "" : value;
  }

  return `${getPublicAssetBase()}${value}`;
}

function normalizeProjectCharacters(characters) {
  if (!Array.isArray(characters)) {
    return [];
  }

  return characters
    .map((item) => ({
      ...item,
      name: typeof item?.name === "string" ? item.name : "",
      image: normalizeAssetUrl(item?.image),
    }))
    .filter((item) => item.name && item.image);
}

function appendChannelVideoForm(formData, body) {
  Object.entries(body || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
      return;
    }

    formData.append(key, value);
  });
}

function normalizeProjectRecord(project) {
  if (!project || typeof project !== "object") {
    return project;
  }

  return {
    ...project,
    thumbnail: normalizeAssetUrl(project.thumbnail),
    characters: normalizeProjectCharacters(project.characters),
  };
}

function buildProjectFormData(body = {}) {
  const formData = new FormData();

  if (typeof body.name === "string") {
    formData.append("name", body.name);
  }

  if (typeof body.description === "string") {
    formData.append("description", body.description);
  }

  if (body.thumbnail instanceof File) {
    formData.append("thumbnail", body.thumbnail);
  }

  if (Object.prototype.hasOwnProperty.call(body, "characters")) {
    const characterInput = Array.isArray(body.characters)
      ? body.characters
      : [];
    const characterPayload = [];
    let uploadedCharacterIndex = 0;

    characterInput.forEach((item) => {
      const name = typeof item?.name === "string" ? item.name.trim() : "";
      if (!name) {
        return;
      }

      const payloadItem = { name };

      if (item?.imageFile instanceof File) {
        formData.append("characterImages", item.imageFile);
        payloadItem.imageFileIndex = uploadedCharacterIndex;
        uploadedCharacterIndex += 1;
      } else if (typeof item?.image === "string" && item.image.trim()) {
        payloadItem.image = item.image.trim();
      }

      characterPayload.push(payloadItem);
    });

    formData.append("characters", JSON.stringify(characterPayload));
  }

  return formData;
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
    projects: Array.isArray(data?.projects)
      ? data.projects.map((project) => normalizeProjectRecord(project))
      : [],
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
    projects: Array.isArray(data?.projects)
      ? data.projects.map((project) => normalizeProjectRecord(project))
      : [],
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
          isPublished: video.isPublished !== false,
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

function normalizeCatalogueRecord(catalogue) {
  if (!catalogue || typeof catalogue !== "object") {
    return catalogue;
  }

  const normalizedImage = normalizeAssetUrl(catalogue.image);
  const normalizedHeader =
    typeof catalogue.header === "string" ? catalogue.header : "";
  const normalizedBody =
    typeof catalogue.body === "string" ? catalogue.body : "";

  return {
    ...catalogue,
    image: normalizedImage,
    header: normalizedHeader,
    body: normalizedBody,
    // Keep compatibility with any existing UI expecting old keys.
    thumbnail: normalizedImage,
    title: normalizedHeader,
    content: normalizedBody,
  };
}

export async function fetchChannelCatalogues(projectId, { signal } = {}) {
  if (
    projectId &&
    typeof projectId === "object" &&
    !Array.isArray(projectId) &&
    Object.prototype.hasOwnProperty.call(projectId, "signal")
  ) {
    return fetchChannelCatalogues(undefined, projectId);
  }

  const normalizedProjectId =
    typeof projectId === "string" ? projectId.trim() : "";

  if (normalizedProjectId) {
    const response = await fetch(
      `${API_BASE}/api/admin/channels/projects/${normalizedProjectId}/catalogues`,
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
        catalogues: [],
        message: data?.message || "Failed to load channel catalogues.",
        status: response.status,
      };
    }

    return {
      ok: true,
      catalogues: Array.isArray(data?.catalogues)
        ? data.catalogues.map((catalogue) =>
            normalizeCatalogueRecord(catalogue)
          )
        : [],
      message: "",
      status: response.status,
    };
  }

  const projectsResult = await fetchChannelProjects({ signal });
  if (!projectsResult.ok) {
    return {
      ok: false,
      catalogues: [],
      message: projectsResult.message || "Failed to load channel catalogues.",
      status: projectsResult.status,
    };
  }

  const projectIds = projectsResult.projects
    .map((project) => project?._id || project?.id)
    .filter(Boolean);

  if (projectIds.length === 0) {
    return {
      ok: true,
      catalogues: [],
      message: "",
      status: 200,
    };
  }

  const projectResponses = await Promise.all(
    projectIds.map(async (id) => {
      const response = await fetch(
        `${API_BASE}/api/admin/channels/projects/${id}/catalogues`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          signal,
        }
      );
      const data = await readJson(response);

      return {
        ok: response.ok,
        status: response.status,
        message: data?.message || "Failed to load channel catalogues.",
        catalogues: Array.isArray(data?.catalogues)
          ? data.catalogues.map((catalogue) =>
              normalizeCatalogueRecord(catalogue)
            )
          : [],
      };
    })
  );

  const failedRequest = projectResponses.find((item) => !item.ok);
  if (failedRequest) {
    handleExpiredAdminSession(failedRequest.status);
    return {
      ok: false,
      catalogues: [],
      message: failedRequest.message,
      status: failedRequest.status,
    };
  }

  return {
    ok: true,
    catalogues: projectResponses.flatMap((item) => item.catalogues),
    message: "",
    status: 200,
  };
}

export async function createChannelCatalogue(projectId, body, { signal } = {}) {
  const formData = new FormData();
  Object.entries(body || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await fetch(
    `${API_BASE}/api/admin/channels/projects/${projectId}/catalogues`,
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
      catalogue: null,
      message: data?.message || "Failed to create catalogue.",
      status: response.status,
    };
  }

  return {
    ok: true,
    catalogue: data?.catalogue
      ? normalizeCatalogueRecord(data.catalogue)
      : null,
    message: "",
    status: response.status,
  };
}

export async function updateChannelCatalogue(
  projectId,
  catalogueId,
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
    `${API_BASE}/api/admin/channels/projects/${projectId}/catalogues/${catalogueId}`,
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
      catalogue: null,
      message: data?.message || "Failed to update catalogue.",
      status: response.status,
    };
  }

  return {
    ok: true,
    catalogue: data?.catalogue
      ? normalizeCatalogueRecord(data.catalogue)
      : null,
    message: "",
    status: response.status,
  };
}

export async function deleteChannelCatalogue(
  projectId,
  catalogueId,
  { signal } = {}
) {
  const response = await fetch(
    `${API_BASE}/api/admin/channels/projects/${projectId}/catalogues/${catalogueId}`,
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
      message: data?.message || "Failed to delete catalogue.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "Catalogue deleted.",
    status: response.status,
  };
}

export async function createChannelVideo(projectId, body, { signal } = {}) {
  const formData = new FormData();
  appendChannelVideoForm(formData, body);

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
          isPublished: data.video.isPublished !== false,
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
  appendChannelVideoForm(formData, body);

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
          isPublished: data.video.isPublished !== false,
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
  const formData = buildProjectFormData(body);

  const response = await fetch(`${API_BASE}/api/admin/projects`, {
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
      project: null,
      message: data?.message || "Failed to create project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    project: data?.project ? normalizeProjectRecord(data.project) : null,
    message: "",
    status: response.status,
  };
}

export async function updateProject(id, body, { signal } = {}) {
  const formData = buildProjectFormData(body);

  const response = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: formData,
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
    project: data?.project ? normalizeProjectRecord(data.project) : null,
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
