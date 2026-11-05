import { getStorageItem, setStorageItem } from "@/lib/reactions/storage";

const SELECTED_NAV_KEY = "sabeel.selectedNav";
const HOME_NAV = "home";

export function getStoredCatalogueNav(allowedIds: string[] = []) {
  const stored = getStorageItem(SELECTED_NAV_KEY)?.trim() || HOME_NAV;
  if (stored === HOME_NAV) {
    return HOME_NAV;
  }

  if (allowedIds.length > 0 && !allowedIds.includes(stored)) {
    return HOME_NAV;
  }

  return stored;
}

export function persistCatalogueNav(nav: string) {
  const next = nav.trim() || HOME_NAV;
  setStorageItem(SELECTED_NAV_KEY, next);
}
