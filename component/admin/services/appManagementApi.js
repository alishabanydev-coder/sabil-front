import { getApiBase, getPublicAssetBase } from '@/lib/apiBase';
import { handleExpiredAdminSession } from './adminSession';

const API_BASE = getApiBase();

function getAuthHeaders(json = false) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function normalizeAssetUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return '';
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  if (value.startsWith('/uploads/')) {
    return `${getPublicAssetBase()}${value}`;
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

function normalizeNavButton(button) {
  if (!button || typeof button !== 'object') {
    return null;
  }

  return {
    ...button,
    image: normalizeAssetUrl(button.image),
  };
}

function normalizeVideo(video) {
  if (!video || typeof video !== 'object') {
    return null;
  }

  return {
    ...video,
    thumbnail: normalizeAssetUrl(video.thumbnail),
  };
}

export async function fetchAdminAppCatalogueNavigationButtons({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/app-catalogue/navigation-buttons`, {
    method: 'GET',
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      homeImage: '',
      homeImageRaw: '',
      selectedProjectIds: [],
      selectedProjects: [],
      availableProjects: [],
      navigationButtons: [],
      message: data?.message || 'Failed to load app catalogue navigation settings.',
      status: response.status,
    };
  }

  const selectedProjects = Array.isArray(data?.selectedProjects)
    ? data.selectedProjects.map((item) => ({
        ...item,
        thumbnail: normalizeAssetUrl(item.thumbnail),
        featuredVideoIds: Array.isArray(item.featuredVideoIds)
          ? item.featuredVideoIds.map(String)
          : [],
      }))
    : [];
  const availableProjects = Array.isArray(data?.availableProjects)
    ? data.availableProjects.map((item) => ({
        ...item,
        thumbnail: normalizeAssetUrl(item.thumbnail),
        featuredVideoIds: Array.isArray(item.featuredVideoIds)
          ? item.featuredVideoIds.map(String)
          : [],
      }))
    : [];

  return {
    ok: true,
    homeImage: normalizeAssetUrl(data?.homeImage),
    homeImageRaw: typeof data?.homeImage === 'string' ? data.homeImage : '',
    selectedProjectIds: Array.isArray(data?.selectedProjectIds) ? data.selectedProjectIds : [],
    selectedProjects,
    availableProjects,
    navigationButtons: Array.isArray(data?.navigationButtons)
      ? data.navigationButtons.map((item) => normalizeNavButton(item)).filter(Boolean)
      : [],
    message: '',
    status: response.status,
  };
}

export async function updateAdminAppCatalogueNavigationButtons(
  { projectIds, homeImage, imageFile } = {},
  { signal } = {}
) {
  const formData = new FormData();
  formData.append('projectIds', JSON.stringify(Array.isArray(projectIds) ? projectIds : []));
  if (typeof homeImage === 'string' && homeImage.trim()) {
    formData.append('homeImage', homeImage.trim());
  }
  if (imageFile instanceof File) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_BASE}/api/admin/app-catalogue/navigation-buttons`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData,
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      homeImage: '',
      homeImageRaw: '',
      selectedProjectIds: [],
      selectedProjects: [],
      navigationButtons: [],
      message: data?.message || 'Failed to save app catalogue navigation settings.',
      status: response.status,
    };
  }

  const selectedProjects = Array.isArray(data?.selectedProjects)
    ? data.selectedProjects.map((item) => ({
        ...item,
        thumbnail: normalizeAssetUrl(item.thumbnail),
        featuredVideoIds: Array.isArray(item.featuredVideoIds)
          ? item.featuredVideoIds.map(String)
          : [],
      }))
    : [];

  return {
    ok: true,
    homeImage: normalizeAssetUrl(data?.homeImage),
    homeImageRaw: typeof data?.homeImage === 'string' ? data.homeImage : '',
    selectedProjectIds: Array.isArray(data?.selectedProjectIds) ? data.selectedProjectIds : [],
    selectedProjects,
    navigationButtons: Array.isArray(data?.navigationButtons)
      ? data.navigationButtons.map((item) => normalizeNavButton(item)).filter(Boolean)
      : [],
    message: '',
    status: response.status,
  };
}

export async function fetchAdminAppCatalogueHomeVideos({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/app-catalogue/home-videos`, {
    method: 'GET',
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      mode: 'random',
      manualVideoIds: [],
      manualVideos: [],
      availableVideos: [],
      message: data?.message || 'Failed to load app catalogue home videos settings.',
      status: response.status,
    };
  }

  return {
    ok: true,
    mode: data?.mode === 'manual' ? 'manual' : 'random',
    manualVideoIds: Array.isArray(data?.manualVideoIds) ? data.manualVideoIds : [],
    manualVideos: Array.isArray(data?.manualVideos)
      ? data.manualVideos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
    availableVideos: Array.isArray(data?.availableVideos)
      ? data.availableVideos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
    message: '',
    status: response.status,
  };
}

export async function updateAdminAppCatalogueHomeVideos(
  { mode, manualVideoIds } = {},
  { signal } = {}
) {
  const response = await fetch(`${API_BASE}/api/admin/app-catalogue/home-videos`, {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      ...(typeof mode === 'string' ? { mode } : {}),
      ...(Array.isArray(manualVideoIds) ? { manualVideoIds } : {}),
    }),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      mode: 'random',
      manualVideoIds: [],
      manualVideos: [],
      message: data?.message || 'Failed to save app catalogue home videos settings.',
      status: response.status,
    };
  }

  return {
    ok: true,
    mode: data?.mode === 'manual' ? 'manual' : 'random',
    manualVideoIds: Array.isArray(data?.manualVideoIds) ? data.manualVideoIds : [],
    manualVideos: Array.isArray(data?.manualVideos)
      ? data.manualVideos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
    message: '',
    status: response.status,
  };
}

export async function fetchAdminAppCatalogueSuggestedVideos({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/app-catalogue/suggested-videos`, {
    method: 'GET',
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      videoIds: [],
      videos: [],
      availableVideos: [],
      message: data?.message || 'Failed to load suggested videos.',
      status: response.status,
    };
  }

  return {
    ok: true,
    videoIds: Array.isArray(data?.videoIds) ? data.videoIds.map(String) : [],
    videos: Array.isArray(data?.videos)
      ? data.videos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
    availableVideos: Array.isArray(data?.availableVideos)
      ? data.availableVideos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
    message: '',
    status: response.status,
  };
}

export async function updateAdminAppCatalogueSuggestedVideos(
  { videoIds } = {},
  { signal } = {}
) {
  const response = await fetch(`${API_BASE}/api/admin/app-catalogue/suggested-videos`, {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      videoIds: Array.isArray(videoIds) ? videoIds : [],
    }),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      videoIds: [],
      videos: [],
      message: data?.message || 'Failed to save suggested videos.',
      status: response.status,
    };
  }

  return {
    ok: true,
    videoIds: Array.isArray(data?.videoIds) ? data.videoIds.map(String) : [],
    videos: Array.isArray(data?.videos)
      ? data.videos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
    message: '',
    status: response.status,
  };
}

export async function fetchAdminProjectFeaturedVideos(projectId, { signal } = {}) {
  const response = await fetch(
    `${API_BASE}/api/admin/app-catalogue/projects/${projectId}/featured-videos`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      projectId: projectId || '',
      videoIds: [],
      videos: [],
      availableVideos: [],
      message: data?.message || 'Failed to load featured videos.',
      status: response.status,
    };
  }

  return {
    ok: true,
    projectId: data?.projectId ? String(data.projectId) : String(projectId),
    videoIds: Array.isArray(data?.videoIds) ? data.videoIds.map(String) : [],
    videos: Array.isArray(data?.videos)
      ? data.videos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
    availableVideos: Array.isArray(data?.availableVideos)
      ? data.availableVideos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
    message: '',
    status: response.status,
  };
}

export async function updateAdminProjectFeaturedVideos(
  projectId,
  { videoIds } = {},
  { signal } = {}
) {
  const response = await fetch(
    `${API_BASE}/api/admin/app-catalogue/projects/${projectId}/featured-videos`,
    {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        videoIds: Array.isArray(videoIds) ? videoIds : [],
      }),
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      projectId: projectId || '',
      videoIds: [],
      videos: [],
      message: data?.message || 'Failed to save featured videos.',
      status: response.status,
    };
  }

  return {
    ok: true,
    projectId: data?.projectId ? String(data.projectId) : String(projectId),
    videoIds: Array.isArray(data?.videoIds) ? data.videoIds.map(String) : [],
    videos: Array.isArray(data?.videos)
      ? data.videos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
    message: '',
    status: response.status,
  };
}

export async function fetchPublicAppCatalogueNavigationButtons() {
  const response = await fetch(`${API_BASE}/api/admin/public/app-catalogue/navigation-buttons`, {
    method: 'GET',
    cache: 'no-store',
  });
  const data = await readJson(response);

  return Array.isArray(data?.buttons)
    ? data.buttons.map((item) => normalizeNavButton(item)).filter(Boolean)
    : [];
}

export async function fetchPublicAppCatalogueHomeVideos() {
  const response = await fetch(`${API_BASE}/api/admin/public/app-catalogue/home-videos`, {
    method: 'GET',
    cache: 'no-store',
  });
  const data = await readJson(response);

  return {
    mode: data?.mode === 'manual' ? 'manual' : 'random',
    videos: Array.isArray(data?.videos)
      ? data.videos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
  };
}

export async function fetchPublicAppCatalogueSuggestedVideos() {
  const response = await fetch(`${API_BASE}/api/admin/public/app-catalogue/suggested-videos`, {
    method: 'GET',
    cache: 'no-store',
  });
  const data = await readJson(response);

  return {
    videoIds: Array.isArray(data?.videoIds) ? data.videoIds.map(String) : [],
    videos: Array.isArray(data?.videos)
      ? data.videos.map((item) => normalizeVideo(item)).filter(Boolean)
      : [],
  };
}

export async function fetchPublicAppCatalogueFeaturedVideos() {
  const response = await fetch(`${API_BASE}/api/admin/public/app-catalogue/featured-videos`, {
    method: 'GET',
    cache: 'no-store',
  });
  const data = await readJson(response);
  const featuredByProjectId = {};

  if (data?.featuredByProjectId && typeof data.featuredByProjectId === 'object') {
    Object.entries(data.featuredByProjectId).forEach(([projectId, value]) => {
      featuredByProjectId[String(projectId)] = Array.isArray(value?.videos)
        ? value.videos.map((item) => normalizeVideo(item)).filter(Boolean)
        : [];
    });
  }

  return {
    featuredByProjectId,
  };
}
