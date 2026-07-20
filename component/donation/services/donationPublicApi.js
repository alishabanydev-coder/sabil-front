import { getApiBase, getPublicAssetBase } from "@/lib/apiBase";

const API_BASE = getApiBase();

export const DONATION_PROJECTS_TAG = "donation-projects";

function normalizeAssetUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/") && !value.startsWith("/uploads/")
  ) {
    return value;
  }

  if (value.startsWith("/uploads/")) {
    return `${getPublicAssetBase()}${value}`;
  }

  return value;
}

function normalizeSectionImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map((image) => normalizeAssetUrl(image)).filter(Boolean);
}

function normalizePublicDonationProject(project) {
  if (!project || typeof project !== "object") {
    return project;
  }

  return {
    ...project,
    _id:
      typeof project._id === "string"
        ? project._id
        : project._id?.toString?.() || "",
    poster: normalizeAssetUrl(project.poster),
    donorCount: Number(project.donorCount ?? 0),
    sections: Array.isArray(project.sections)
      ? project.sections.map((section) => ({
          ...section,
          images: normalizeSectionImages(section.images),
        }))
      : [],
    faq: Array.isArray(project.faq) ? project.faq : [],
    updates: Array.isArray(project.updates)
      ? project.updates.map((update) => ({
          ...update,
          authorAvatar: normalizeAssetUrl(update.authorAvatar),
          images: normalizeSectionImages(update.images),
        }))
      : [],
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchPublicDonationProjects() {
  const response = await fetch(
    `${API_BASE}/api/admin/public/donation-projects`,
    {
      method: "GET",
      next: { tags: [DONATION_PROJECTS_TAG] },
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
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
      ? data.donationProjects.map(normalizePublicDonationProject)
      : [],
    message: "",
    status: response.status,
  };
}

export async function fetchPublicDonationProject(slugOrId) {
  const normalizedId = String(slugOrId ?? "").trim();

  if (!normalizedId) {
    return {
      ok: false,
      donationProject: null,
      message: "Donation project id is required.",
      status: 400,
    };
  }

  const response = await fetch(
    `${API_BASE}/api/admin/public/donation-projects/${encodeURIComponent(normalizedId)}`,
    {
      method: "GET",
      next: { tags: [DONATION_PROJECTS_TAG] },
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      donationProject: null,
      message: data?.message || "Failed to load donation project.",
      status: response.status,
    };
  }

  return {
    ok: true,
    donationProject: normalizePublicDonationProject(data?.donationProject),
    message: "",
    status: response.status,
  };
}
