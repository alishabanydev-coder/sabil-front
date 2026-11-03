import { getStorageItem, setStorageItem } from "./storage";

export type ReactionType = "like" | "save";

const LIST_KEYS: Record<ReactionType, string> = {
  like: "sabeel.liked",
  save: "sabeel.saved",
};

const listeners = new Set<() => void>();
const pendingKeys = new Set<string>();
const counts: Record<ReactionType, Map<string, number>> = {
  like: new Map(),
  save: new Map(),
};

let version = 0;

function emit() {
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeReactions(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getReactionsSnapshot() {
  return version;
}

function pendingKey(type: ReactionType, videoId: string) {
  return `${type}:${videoId}`;
}

function readIds(type: ReactionType): string[] {
  const raw = getStorageItem(LIST_KEYS[type]);
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

function writeIds(type: ReactionType, ids: string[]) {
  setStorageItem(LIST_KEYS[type], JSON.stringify(ids));
  emit();
}

export function hasReaction(type: ReactionType, videoId: string) {
  if (!videoId) {
    return false;
  }

  return readIds(type).includes(videoId);
}

export function setReactionActive(
  type: ReactionType,
  videoId: string,
  active: boolean
) {
  if (!videoId) {
    return;
  }

  const ids = readIds(type);
  const exists = ids.includes(videoId);

  if (active && !exists) {
    writeIds(type, [...ids, videoId]);
    return;
  }

  if (!active && exists) {
    writeIds(type, ids.filter((id) => id !== videoId));
    return;
  }

  emit();
}

export function getReactionCount(
  type: ReactionType,
  videoId: string,
  fallback: number
) {
  if (!videoId) {
    return Math.max(0, fallback);
  }

  const stored = counts[type].get(videoId);
  return stored === undefined ? Math.max(0, fallback) : stored;
}

export function setReactionCount(
  type: ReactionType,
  videoId: string,
  count: number
) {
  if (!videoId) {
    return;
  }

  counts[type].set(videoId, Math.max(0, Number(count) || 0));
  emit();
}

export function seedReactionCount(
  type: ReactionType,
  videoId: string,
  count: number
) {
  if (!videoId || counts[type].has(videoId)) {
    return;
  }

  counts[type].set(videoId, Math.max(0, Number(count) || 0));
}

export function isReactionPending(type: ReactionType, videoId: string) {
  return pendingKeys.has(pendingKey(type, videoId));
}

export function setReactionPending(
  type: ReactionType,
  videoId: string,
  pending: boolean
) {
  const key = pendingKey(type, videoId);
  if (pending) {
    pendingKeys.add(key);
  } else {
    pendingKeys.delete(key);
  }
  emit();
}
