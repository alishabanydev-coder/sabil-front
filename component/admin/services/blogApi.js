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
  const textSections = Array.isArray(body?.textSections) ? body.textSections : [];
  const images = Array.isArray(body?.images) ? body.images : [];

  formData.append("title", body?.title || "");
  formData.append("subHeader", body?.subHeader || "");
  formData.append("videoUrl", body?.videoUrl || "");
  formData.append("texts", JSON.stringify(textSections));
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
