import { getApiBase } from "@/lib/apiBase";
import { handleExpiredAdminSession } from "./adminSession";

const API_BASE = getApiBase();

export type YtReportChannelItem = {
  _id: string;
  youtubeChannelId: string;
  channelTitle: string;
  channelThumbnail: string;
  adminName: string;
  updatedAt?: string;
};

export type YtReportRow = {
  youtubeChannelId: string;
  year: number;
  dateOfReport: string;
  adminName: string;
  channelName: string;
  month: string;
  subscribersGained: number;
  subscribersLastOfMonth: number;
  subscriberGrowthRate: number;
  totalViews: number;
  noVideo: number;
  noShorts: number;
  totalWatchTimeHours: number;
  numberOfComments: number;
  revenue: number;
  impressions: number;
  ctr: number;
  averageViewDuration: number;
};

export type YtReportChannelError = {
  youtubeChannelId: string;
  channelTitle: string;
  message: string;
};

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchYtReportChannels() {
  const response = await fetch(`${API_BASE}/api/admin/yt-reports/channels`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      oauthConfigured: false,
      channels: [] as YtReportChannelItem[],
      message: data?.message || "Failed to load connected channels.",
    };
  }

  return {
    ok: true,
    oauthConfigured: Boolean(data?.oauthConfigured),
    channels: (Array.isArray(data?.channels) ? data.channels : []) as YtReportChannelItem[],
    message: "",
  };
}

export async function startYtReportOAuth() {
  const response = await fetch(`${API_BASE}/api/admin/yt-reports/oauth/start`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.authUrl) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      authUrl: "",
      message: data?.message || "Failed to start YouTube OAuth.",
    };
  }

  return {
    ok: true,
    authUrl: String(data.authUrl),
    message: "",
  };
}

export async function disconnectYtReportChannel(youtubeChannelId: string) {
  const response = await fetch(
    `${API_BASE}/api/admin/yt-reports/channels/${encodeURIComponent(youtubeChannelId)}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      message: data?.message || "Failed to disconnect channel.",
    };
  }

  return {
    ok: true,
    message: data?.message || "Channel disconnected.",
  };
}

export async function fetchFreshYtReport(startDate: string, endDate: string) {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await fetch(
    `${API_BASE}/api/admin/yt-reports/report?${params.toString()}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      rows: [] as YtReportRow[],
      errors: [] as YtReportChannelError[],
      message: data?.message || "Failed to fetch YouTube report.",
    };
  }

  return {
    ok: true,
    startDate: String(data?.startDate || startDate),
    endDate: String(data?.endDate || endDate),
    rows: (Array.isArray(data?.rows) ? data.rows : []) as YtReportRow[],
    errors: (Array.isArray(data?.errors) ? data.errors : []) as YtReportChannelError[],
    message: "",
  };
}

export async function downloadYtReportExcel(startDate: string, endDate: string) {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await fetch(
    `${API_BASE}/api/admin/yt-reports/export-excel?${params.toString()}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    const err = await response.json().catch(() => null);
    return {
      ok: false,
      message: err?.message || "Failed to export Excel file.",
    };
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `yt-report-${startDate}-to-${endDate}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return {
    ok: true,
    message: "Excel report downloaded.",
  };
}

export async function syncYtReportToGoogleSheet(startDate: string, endDate: string) {
  const response = await fetch(`${API_BASE}/api/admin/yt-reports/sync-sheet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ startDate, endDate }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      rows: [] as YtReportRow[],
      errors: [] as YtReportChannelError[],
      message: data?.message || "Failed to sync report to Google Sheet.",
    };
  }

  return {
    ok: true,
    rows: (Array.isArray(data?.rows) ? data.rows : []) as YtReportRow[],
    errors: (Array.isArray(data?.errors) ? data.errors : []) as YtReportChannelError[],
    message: data?.message || "Synced to Google Sheet.",
  };
}
