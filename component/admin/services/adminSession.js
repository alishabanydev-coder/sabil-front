export const ADMIN_SESSION_EXPIRED_EVENT = "admin-session-expired";

export function clearAdminSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("permissions");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
}

export function handleExpiredAdminSession(status) {
  if (status !== 401 || typeof window === "undefined") {
    return;
  }

  clearAdminSession();
  window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
}
