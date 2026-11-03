import { getStorageItem, setStorageItem } from "./storage";

export type VideoProgress = {
  position: number;
  duration: number;
  played: number;
  updatedAt: number;
};

export type ProgressMap = Record<string, VideoProgress>;

const WATCHED_KEY = "sabeel.watched";
const PROGRESS_KEY = "sabeel.progress";

const listeners = new Set<() => void>();
let version = 0;

function emit() {
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribePlaylist(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPlaylistSnapshot() {
  return version;
}

function readWatched(): string[] {
  const raw = getStorageItem(WATCHED_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (id): id is string => typeof id === "string" && id.trim().length > 0
    );
  } catch {
    return [];
  }
}

function writeWatched(ids: string[]) {
  setStorageItem(WATCHED_KEY, JSON.stringify(ids));
  emit();
}

function readProgress(): ProgressMap {
  const raw = getStorageItem(PROGRESS_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const next: ProgressMap = {};
    Object.entries(parsed).forEach(([videoId, value]) => {
      if (!videoId || !value || typeof value !== "object") {
        return;
      }

      const position = Number((value as VideoProgress).position);
      const duration = Number((value as VideoProgress).duration);
      const played = Number((value as VideoProgress).played);
      const updatedAt = Number((value as VideoProgress).updatedAt);
      if (!Number.isFinite(position) || position < 0) {
        return;
      }

      next[videoId] = {
        position,
        duration: Number.isFinite(duration) && duration > 0 ? duration : 0,
        played: Number.isFinite(played) && played > 0 ? played : 0,
        updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
      };
    });

    return next;
  } catch {
    return {};
  }
}

function writeProgress(map: ProgressMap) {
  setStorageItem(PROGRESS_KEY, JSON.stringify(map));
  emit();
}

export function isWatched(videoId: string) {
  if (!videoId) {
    return false;
  }

  return readWatched().includes(videoId);
}

export function markWatched(videoId: string) {
  const id = videoId.trim();
  if (!id) {
    return;
  }

  const ids = readWatched();
  if (ids.includes(id)) {
    return;
  }

  writeWatched([...ids, id]);
}

export function getProgress(videoId: string): VideoProgress | null {
  const id = videoId.trim();
  if (!id) {
    return null;
  }

  return readProgress()[id] ?? null;
}

export function getAllProgress(): ProgressMap {
  return readProgress();
}

export function setProgress(
  videoId: string,
  position: number,
  duration: number,
  played = 0
) {
  const id = videoId.trim();
  if (!id) {
    return;
  }

  const nextPosition = Math.max(0, Number(position) || 0);
  const nextDuration = Math.max(0, Number(duration) || 0);
  const nextPlayed = Math.max(0, Number(played) || 0);
  const map = readProgress();

  map[id] = {
    position: nextPosition,
    duration: nextDuration,
    played: nextPlayed,
    updatedAt: Date.now(),
  };

  writeProgress(map);
}
