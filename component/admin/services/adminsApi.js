const API_BASE =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_ADMIN_API_URL) ||
  "http://localhost:5000";

/**
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function fetchAdmins({ signal } = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_BASE}/api/admin/admins`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    return {
      ok: false,
      admins: [],
      message: data?.message || "Failed to load admins.",
      status: response.status,
    };
  }

  return {
    ok: true,
    admins: Array.isArray(data?.admins) ? data.admins : [],
    message: "",
    status: response.status,
  };
}

/**
 * @param {object} body
 * @param {string} body.userName
 * @param {string} body.name
 * @param {string} body.password
 * @param {string} [body.role]
 * @param {object[]} [body.permissions]
 * @param {AbortSignal} [options.signal]
 */
export async function createAdmin(body, { signal } = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_BASE}/api/admin/admins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    return {
      ok: false,
      admin: null,
      message: data?.message || "Failed to create admin.",
      status: response.status,
    };
  }

  return {
    ok: true,
    admin: data?.admin ?? null,
    message: "",
    status: response.status,
  };
}

export async function updateAdmin(id, body, { signal } = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_BASE}/api/admin/admins/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    return {
      ok: false,
      admin: null,
      message: data?.message || "Failed to update admin.",
      status: response.status,
    };
  }

  return {
    ok: true,
    admin: data?.admin ?? null,
    message: "",
    status: response.status,
  };
}

export async function deleteAdmin(id, { signal } = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_BASE}/api/admin/admins/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    return {
      ok: false,
      message: data?.message || "Failed to delete admin.",
      status: response.status,
    };
  }

  return {
    ok: true,
    message: data?.message || "Admin deleted.",
    status: response.status,
  };
}
