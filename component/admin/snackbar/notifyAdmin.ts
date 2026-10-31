export type AdminNoticeSeverity = "success" | "error" | "info" | "warning";

export type AdminNotice = {
  id: number;
  message: string;
  severity: AdminNoticeSeverity;
};

type Listener = (notice: AdminNotice) => void;

const listeners = new Set<Listener>();
let nextId = 1;

export function subscribeAdminNotices(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyAdmin(
  message: string,
  severity: AdminNoticeSeverity = "info"
) {
  const text = message.trim();
  if (!text) {
    return;
  }

  const notice: AdminNotice = {
    id: nextId,
    message: text,
    severity,
  };
  nextId += 1;

  listeners.forEach((listener) => listener(notice));
}

export function notifyAdminSuccess(message: string) {
  notifyAdmin(message, "success");
}

export function notifyAdminError(message: string) {
  notifyAdmin(message, "error");
}
