"use client";

import { toggleReaction } from "@/component/appCatalogue/services/reactionsApi";
import {
  getReactionCount,
  getReactionsSnapshot,
  hasReaction,
  isReactionPending,
  seedReactionCount,
  setReactionActive,
  setReactionCount,
  setReactionPending,
  subscribeReactions,
  type ReactionType,
} from "@/lib/reactions/reactionStore";
import { useCallback, useEffect, useSyncExternalStore } from "react";

export function useVideoReaction(
  videoId: string,
  type: ReactionType,
  serverCount = 0
) {
  useSyncExternalStore(
    subscribeReactions,
    getReactionsSnapshot,
    () => 0
  );

  useEffect(() => {
    seedReactionCount(type, videoId, serverCount);
  }, [serverCount, type, videoId]);

  const active = hasReaction(type, videoId);
  const count = getReactionCount(type, videoId, serverCount);
  const pending = isReactionPending(type, videoId);

  const toggle = useCallback(async () => {
    if (!videoId || pending) {
      return;
    }

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return;
    }

    const action = active ? "remove" : "add";
    setReactionPending(type, videoId, true);

    try {
      const result = await toggleReaction(videoId, type, action);
      if (!result.ok) {
        return;
      }

      setReactionActive(type, videoId, result.active);
      setReactionCount(type, videoId, result.count);
    } finally {
      setReactionPending(type, videoId, false);
    }
  }, [active, pending, type, videoId]);

  return { active, count, pending, toggle };
}
