import { handleExpiredAdminSession } from "./adminSession";

import { getApiBase } from "@/lib/apiBase";

const API_BASE = getApiBase();

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

function normalizeSiteUserRecord(user) {
  if (!user || typeof user !== "object") {
    return user;
  }

  return {
    ...user,
    _id:
      typeof user._id === "string"
        ? user._id
        : user._id?.toString?.() || "",
    donationCount: Number(user.donationCount ?? 0),
    totalAmount: Number(user.totalAmount ?? 0),
    donatedProjects: Array.isArray(user.donatedProjects)
      ? user.donatedProjects
      : [],
    showAsAnonymousInDonations: Boolean(user.showAsAnonymousInDonations),
    isActive: Boolean(user.isActive ?? true),
  };
}

export async function fetchSiteUsers({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/site-users`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      users: [],
      message: data?.message || "Failed to load users.",
      status: response.status,
    };
  }

  return {
    ok: true,
    users: Array.isArray(data?.users)
      ? data.users.map(normalizeSiteUserRecord)
      : [],
    message: "",
    status: response.status,
  };
}

export async function createSiteUser(body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/site-users`, {
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
      user: null,
      message: data?.message || "Failed to create user.",
      status: response.status,
    };
  }

  return {
    ok: true,
    user: data?.user ? normalizeSiteUserRecord(data.user) : null,
    message: "",
    status: response.status,
  };
}

export async function fetchSiteUser(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/site-users/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      user: null,
      donations: [],
      donationCount: 0,
      totalAmount: 0,
      message: data?.message || "Failed to load user.",
      status: response.status,
    };
  }

  return {
    ok: true,
    user: data?.user ? normalizeSiteUserRecord(data.user) : null,
    donations: Array.isArray(data?.donations) ? data.donations : [],
    donationCount: Number(data?.donationCount ?? 0),
    totalAmount: Number(data?.totalAmount ?? 0),
    message: "",
    status: response.status,
  };
}

export async function updateSiteUser(id, body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/site-users/${id}`, {
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
      user: null,
      message: data?.message || "Failed to update user.",
      status: response.status,
    };
  }

  return {
    ok: true,
    user: data?.user ? normalizeSiteUserRecord(data.user) : null,
    message: "",
    status: response.status,
  };
}

export async function deleteSiteUser(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/site-users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      message: data?.message || "Failed to delete user.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "User deactivated.",
    status: response.status,
  };
}

export async function createSiteUserDonation(userId, body, { signal } = {}) {
  const response = await fetch(
    `${API_BASE}/api/admin/site-users/${userId}/donations`,
    {
      method: "POST",
      headers: getAuthHeaders(true),
      body: JSON.stringify(body),
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      donation: null,
      message: data?.message || "Failed to add donation.",
      status: response.status,
    };
  }

  return {
    ok: true,
    donation: data?.donation ?? null,
    message: "",
    status: response.status,
  };
}

export async function updateDonation(id, body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/donations/${id}`, {
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
      donation: null,
      message: data?.message || "Failed to update donation.",
      status: response.status,
    };
  }

  return {
    ok: true,
    donation: data?.donation ?? null,
    message: "",
    status: response.status,
  };
}

export async function deleteDonation(id, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/donations/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      message: data?.message || "Failed to delete donation.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "Donation deleted.",
    status: response.status,
  };
}
