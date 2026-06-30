import { getApiBase } from "@/lib/apiBase";

const API_BASE = getApiBase();
export const USER_TOKEN_KEY = "userToken";

function getUserAuthHeaders(json = false) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(USER_TOKEN_KEY)
      : null;

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

export function getStoredUserToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(USER_TOKEN_KEY);
}

export function clearUserSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(USER_TOKEN_KEY);
}

export function saveUserSession(token) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(USER_TOKEN_KEY, token);
}

export async function registerUser(body) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      message: data?.message || "Registration failed.",
      user: null,
      token: null,
    };
  }

  return {
    ok: true,
    message: "",
    user: data?.user ?? null,
    token: data?.token ?? null,
  };
}

export async function loginUser(body) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      message: data?.message || "Login failed.",
      user: null,
      token: null,
    };
  }

  return {
    ok: true,
    message: "",
    user: data?.user ?? null,
    token: data?.token ?? null,
  };
}

export async function fetchCurrentUser() {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    method: "GET",
    headers: getUserAuthHeaders(),
  });
  const data = await readJson(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearUserSession();
    }

    return {
      ok: false,
      message: data?.message || "Failed to load user.",
      user: null,
    };
  }

  return {
    ok: true,
    message: "",
    user: data?.user ?? null,
  };
}
