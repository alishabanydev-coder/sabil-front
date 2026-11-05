import { getApiBase } from "@/lib/apiBase";
import { getDeviceId } from "@/lib/reactions/deviceId";

const API_BASE = getApiBase();

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function toggleReaction(videoId, type, action) {
  const normalizedVideoId = typeof videoId === "string" ? videoId.trim() : "";
  if (!normalizedVideoId) {
    return {
      ok: false,
      active: action === "add",
      count: 0,
      status: 400,
      message: "Video id is required.",
    };
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/admin/public/videos/${normalizedVideoId}/reactions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          type,
          action,
        }),
      }
    );
    const data = await readJson(response);

    if (!response.ok) {
      return {
        ok: false,
        active: action === "add",
        count: Number(data?.count) || 0,
        status: response.status,
        message:
          data?.message ||
          (response.status === 429
            ? "Too many reactions. Please wait a moment."
            : "Failed to update reaction."),
      };
    }

    return {
      ok: true,
      active: data?.active === true,
      count: Math.max(0, Number(data?.count) || 0),
      status: response.status,
      message: "",
    };
  } catch {
    return {
      ok: false,
      active: action === "add",
      count: 0,
      status: 0,
      message: "Failed to update reaction.",
    };
  }
}

export async function countAppView(videoId) {
  const normalizedVideoId = typeof videoId === "string" ? videoId.trim() : "";

  if (!normalizedVideoId) {
    return { ok: false, count: 0 };
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/admin/public/videos/${normalizedVideoId}/views`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: getDeviceId() }),
        keepalive: true,
      }
    );
    const data = await readJson(response);
    if (!response.ok) {
      return { ok: false, count: Math.max(0, Number(data?.count) || 0) };
    }
    return { ok: true, count: Math.max(0, Number(data?.count) || 0) };
  } catch {
    return { ok: false, count: 0 };
  }
}
