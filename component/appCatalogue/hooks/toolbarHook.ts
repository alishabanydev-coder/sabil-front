"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { VideoData } from "../component/navbarTypes";
import { getAllProgress, subscribePlaylist, getPlaylistSnapshot } from "@/lib/reactions/playlistStore";
import { getReactionsSnapshot, subscribeReactions } from "@/lib/reactions/reactionStore";
import { getStorageItem } from "@/lib/reactions/storage";

const FINISHED_RATIO = 0.9;
const SAVED_KEY = "sabeel.saved";
const WATCHED_KEY = "sabeel.watched";

export type ToolbarMode = "mostLiked" | "saved" | "watched" | "mostViewed";

function serverSnapshot() {
  return 0;
}

function readIdList(key: string) {
  const raw = getStorageItem(key);
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

function likeScore(video: VideoData) {
  return (Number(video.localLikeCount) || 0) + (Number(video.likeCount) || 0);
}

function viewScore(video: VideoData) {
  return (Number(video.appViewCount) || 0) + (Number(video.viewCount) || 0);
}

function isSeen(
  video: VideoData,
  watchedIds: Set<string>,
  progress: { position: number; duration: number } | undefined
) {
  if (watchedIds.has(video._id)) {
    return true;
  }

  if (!progress) {
    return false;
  }

  const duration = progress.duration || Number(video.duration) || 0;
  if (duration <= 0) {
    return false;
  }

  return progress.position >= duration * FINISHED_RATIO;
}

function byScore(score: (video: VideoData) => number) {
  return (left: VideoData, right: VideoData) => score(right) - score(left);
}

function brief(video: VideoData) {
  return {
    id: video._id,
    title: video.title,
    projectId: video.projectId,
    likes: likeScore(video),
    views: viewScore(video),
  };
}

export function useToolbar(allVideos: VideoData[], selectedNav: string) {
  const [open, setOpen] = useState(true);
  const [channelId, setChannelId] = useState("all");
  const [mode] = useState<ToolbarMode>("mostLiked");
  const reactionVersion = useSyncExternalStore(
    subscribeReactions,
    getReactionsSnapshot,
    serverSnapshot
  );
  const playlistVersion = useSyncExternalStore(
    subscribePlaylist,
    getPlaylistSnapshot,
    serverSnapshot
  );

  useEffect(() => {
    setChannelId(selectedNav === "home" ? "all" : selectedNav);
  }, [selectedNav]);

  const savedIds = useMemo(
    () => new Set(readIdList(SAVED_KEY)),
    [reactionVersion]
  );
  const watchedIds = useMemo(
    () => new Set(readIdList(WATCHED_KEY)),
    [playlistVersion]
  );
  const progressById = useMemo(() => getAllProgress(), [playlistVersion]);

  const lists = useMemo(() => {
    const scoped =
      channelId === "all"
        ? allVideos
        : allVideos.filter((video) => video.projectId === channelId);
    const mostLiked = [...scoped].sort(byScore(likeScore));
    const mostViewed = [...scoped].sort(byScore(viewScore));
    const saved = scoped.filter((video) => savedIds.has(video._id));
    const seen = scoped.filter((video) =>
      isSeen(video, watchedIds, progressById[video._id])
    );
    const remaining = scoped.filter(
      (video) => !isSeen(video, watchedIds, progressById[video._id])
    );

    return { mostLiked, mostViewed, saved, seen, remaining };
  }, [allVideos, channelId, progressById, savedIds, watchedIds]);

  useEffect(() => {
    console.log("[toolbar]", {
      channelId,
      mode,
      mostLiked: lists.mostLiked.map(brief),
      saved: lists.saved.map(brief),
      watched: {
        seen: lists.seen.map(brief),
        remaining: lists.remaining.map(brief),
      },
      mostViewed: lists.mostViewed.map(brief),
    });
  }, [channelId, lists, mode]);

  return {
    open,
    close: () => setOpen(false),
  };
}
