import { getApiBase } from "@/lib/apiBase";

const API_BASE = getApiBase();

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function createPublicSupporter(body, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/admin/public/supporters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
    signal,
  });
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      supporter: null,
      message: data?.message || "Failed to send your request.",
      status: response.status,
    };
  }

  return {
    ok: true,
    supporter: data?.supporter ?? null,
    message: "",
    status: response.status,
  };
}
