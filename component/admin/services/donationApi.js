import { handleExpiredAdminSession } from "./adminSession";

import { getApiBase } from "@/lib/apiBase";

const API_BASE = getApiBase();

function normalizeAssetUrl(value) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return value;
  }

  return `${API_BASE}${value}`;
}

function normalizeSectionImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map((image) => normalizeAssetUrl(image)).filter(Boolean);
}

function normalizeDonationProjectRecord(project) {
  if (!project || typeof project !== "object") {
    return project;
  }

  return {
    ...project,
    poster: normalizeAssetUrl(project.poster),
    donorCount: Number(project.donorCount ?? 0),
    sections: Array.isArray(project.sections)
      ? project.sections.map((section) => ({
          ...section,
          images: normalizeSectionImages(section.images),
        }))
      : [],
    faq: Array.isArray(project.faq) ? project.faq : [],
    updateRefs: Array.isArray(project.updateRefs) ? project.updateRefs : [],
  };
}

function slugifyTitle(title) {
  const slug = String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);

  return slug || `donation-${Date.now()}`;
}

function buildSectionsPayload(sections = []) {
  const sectionImages = [];
  const payload = sections.map((section) => {
    const images = (section.images ?? []).map((imageItem) => {
      if (imageItem?.file instanceof File) {
        const imageFileIndex = sectionImages.length;
        sectionImages.push(imageItem.file);
        return { imageFileIndex };
      }

      const url =
        typeof imageItem === "string"
          ? imageItem
          : typeof imageItem?.url === "string"
            ? imageItem.url
            : "";

      if (!url || url.startsWith("blob:")) {
        return null;
      }

      return url.startsWith(API_BASE) ? url.slice(API_BASE.length) : url;
    });

    return {
      id: section.id,
      header: section.header ?? "",
      text: section.text ?? "",
      order: section.order ?? 0,
      images: images.filter(Boolean),
    };
  });

  return { payload, sectionImages };
}

function buildDonationFormData(body = {}) {
  const formData = new FormData();

  if (typeof body.title === "string") {
    formData.append("title", body.title);
  }

  formData.append("slug", body.slug || slugifyTitle(body.title));

  if (typeof body.shortDescription === "string") {
    formData.append("shortDescription", body.shortDescription);
  }

  if (body.poster instanceof File) {
    formData.append("poster", body.poster);
  } else if (typeof body.existingPoster === "string" && body.existingPoster) {
    formData.append("existingPoster", body.existingPoster);
  }

  if (typeof body.videoUrl === "string") {
    formData.append("videoUrl", body.videoUrl);
  }

  if (body.goalAmount !== undefined && body.goalAmount !== null) {
    formData.append("goalAmount", String(body.goalAmount));
  }

  if (body.raisedAmount !== undefined && body.raisedAmount !== null) {
    formData.append("raisedAmount", String(body.raisedAmount));
  }

  if (body.donorCount !== undefined && body.donorCount !== null) {
    formData.append("donorCount", String(body.donorCount));
  }

  if (body.currency) {
    formData.append("currency", body.currency);
  }

  if (body.status) {
    formData.append("status", body.status);
  }

  if (body.startDate) {
    formData.append("startDate", body.startDate);
  }

  if (body.endDate) {
    formData.append("endDate", body.endDate);
  } else {
    formData.append("endDate", "");
  }

  if (body.projectId) {
    formData.append("projectId", body.projectId);
  } else {
    formData.append("projectId", "");
  }

  formData.append("showOnDonationPage", String(Boolean(body.showOnDonationPage)));

  if (body.listOrder !== undefined && body.listOrder !== null && body.listOrder !== "") {
    formData.append("listOrder", String(body.listOrder));
  } else {
    formData.append("listOrder", "");
  }

  if (Array.isArray(body.sections)) {
    const { payload, sectionImages } = buildSectionsPayload(body.sections);
    formData.append("sections", JSON.stringify(payload));
    sectionImages.forEach((file) => {
      formData.append("sectionImages", file);
    });
  }

  if (Array.isArray(body.faq)) {
    formData.append("faq", JSON.stringify(body.faq));
  }

  if (Array.isArray(body.updateRefs)) {
    formData.append("updateRefs", JSON.stringify(body.updateRefs));
  }

  return formData;
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

export async function fetchDonationProjects({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/donation-projects`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      donationProjects: [],
      message: data?.message || "Failed to load donation projects.",
      status: response.status,
    };
  }

  return {
    ok: true,
    donationProjects: Array.isArray(data?.donationProjects)
      ? data.donationProjects.map(normalizeDonationProjectRecord)
      : [],
    message: "",
    status: response.status,
  };
}

export async function fetchDonationProject(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/donation-projects/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      donationProject: null,
      message: data?.message || "Failed to load donation project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    donationProject: normalizeDonationProjectRecord(data?.donationProject),
    message: "",
    status: response.status,
  };
}

export async function createDonationProject(body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/donation-projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: buildDonationFormData(body),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      donationProject: null,
      message: data?.message || "Failed to create donation project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    donationProject: normalizeDonationProjectRecord(data?.donationProject),
    message: "",
    status: response.status,
  };
}

export async function updateDonationProject(id, body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/donation-projects/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: buildDonationFormData(body),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      donationProject: null,
      message: data?.message || "Failed to update donation project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    donationProject: normalizeDonationProjectRecord(data?.donationProject),
    message: "",
    status: response.status,
  };
}

export async function deleteDonationProject(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/donation-projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);

    return {
      ok: false,
      message: data?.message || "Failed to delete donation project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "",
    status: response.status,
  };
}

export { normalizeDonationProjectRecord, slugifyTitle };

export async function revalidateDonationProjectsPublicCache() {
  try {
    await fetch("/api/revalidate-donation-projects", {
      method: "POST",
    });
  } catch {
    // Ignore revalidate errors so admin save flow is not blocked.
  }
}
