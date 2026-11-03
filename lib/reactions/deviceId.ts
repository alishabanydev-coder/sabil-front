import { getStorageItem, setStorageItem } from "./storage";

export const DEVICE_ID_KEY = "sabeel.deviceId";
const DEVICE_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

function createDeviceId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  let id = "";
  for (let index = 0; index < 36; index += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

export function getDeviceId() {
  const existing = getStorageItem(DEVICE_ID_KEY);
  if (existing && DEVICE_ID_PATTERN.test(existing)) {
    return existing;
  }

  const created = createDeviceId();
  setStorageItem(DEVICE_ID_KEY, created);
  return created;
}
