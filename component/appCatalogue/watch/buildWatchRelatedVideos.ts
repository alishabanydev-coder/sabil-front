export type WatchCatalogueVideo = {
  _id: string;
  projectId: string;
  title: string;
  thumbnail: string;
  projectTitle?: string;
  projectThumbnail?: string;
  showInHomepage?: boolean;
  episode?: number;
  season?: number;
};

function episodeOrder(video: WatchCatalogueVideo): number {
  const season =
    typeof video.season === "number" && Number.isFinite(video.season)
      ? video.season
      : 0;
  const episode =
    typeof video.episode === "number" && Number.isFinite(video.episode)
      ? video.episode
      : 0;
  return season * 1000 + episode;
}

export function buildWatchRelatedVideos({
  allVideos,
  currentVideoId,
  projectId,
}: {
  allVideos: WatchCatalogueVideo[];
  currentVideoId: string;
  projectId: string | null | undefined;
}): WatchCatalogueVideo[] {
  const normalizedCurrentId = currentVideoId.trim();
  const normalizedProjectId =
    typeof projectId === "string" ? projectId.trim() : "";

  if (!normalizedProjectId) {
    return [];
  }

  return allVideos
    .filter(
      (video) =>
        video._id &&
        video._id !== normalizedCurrentId &&
        String(video.projectId) === normalizedProjectId
    )
    .sort((left, right) => episodeOrder(left) - episodeOrder(right));
}
