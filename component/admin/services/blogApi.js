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

export async function fetchBlogs({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/blogs`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      blogs: [],
      message: data?.message || "Failed to load blogs.",
      status: response.status,
    };
  }

  return {
    ok: true,
    blogs: Array.isArray(data?.blogs)
      ? data.blogs.map((blog) => ({
          ...blog,
          image: Array.isArray(blog.image) ? blog.image.map(normalizeAssetUrl) : [],
        }))
      : [],
    message: "",
    status: response.status,
  };
}

export async function createBlog(body, { signal } = {}) {
  const formData = new FormData();
  const images = Array.isArray(body?.images) ? body.images : [];

  formData.append("title", body?.title || "");
  formData.append("subHeader", body?.subHeader || "");
  formData.append("videoUrl", body?.videoUrl || "");
  formData.append("content", body?.content || "");
  images.forEach((imageFile) => {
    formData.append("images", imageFile);
  });

  const response = await fetch(`${API_BASE}/api/admin/blogs`, {
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
      blog: null,
      message: data?.message || "Failed to create blog.",
      status: response.status,
    };
  }

  return {
    ok: true,
    blog: data?.blog
      ? {
          ...data.blog,
          image: Array.isArray(data.blog.image)
            ? data.blog.image.map(normalizeAssetUrl)
            : [],
        }
      : null,
    message: "",
    status: response.status,
  };
}

export async function updateBlog(id, body, { signal } = {}) {
  const formData = new FormData();
  const images = Array.isArray(body?.images) ? body.images : [];
  const keepImages = Array.isArray(body?.keepImages) ? body.keepImages : [];

  formData.append('title', body?.title || '');
  formData.append('subHeader', body?.subHeader || '');
  formData.append('videoUrl', body?.videoUrl || '');
  formData.append('content', body?.content || '');
  formData.append('keepImages', JSON.stringify(keepImages));
  images.forEach((imageFile) => {
    formData.append('images', imageFile);
  });

  const response = await fetch(`${API_BASE}/api/admin/blogs/${id}`, {
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
      blog: null,
      message: data?.message || 'Failed to update blog.',
      status: response.status,
    };
  }

  return {
    ok: true,
    blog: data?.blog
      ? {
          ...data.blog,
          image: Array.isArray(data.blog.image)
            ? data.blog.image.map(normalizeAssetUrl)
            : [],
        }
      : null,
    message: '',
    status: response.status,
  };
}

export async function deleteBlog(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/blogs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      message: data?.message || 'Failed to delete blog.',
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || '',
    status: response.status,
  };
}
