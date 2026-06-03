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

function isHomepageVisible(video: WatchCatalogueVideo): boolean {
  return video.showInHomepage === true;
}

const DEFAULT_MAX_RANDOM = 12;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function buildWatchRelatedVideos({
  allVideos,
  currentVideoId,
  projectId,
  maxRandom = DEFAULT_MAX_RANDOM,
}: {
  allVideos: WatchCatalogueVideo[];
  currentVideoId: string;
  projectId: string | null | undefined;
  maxRandom?: number;
}): WatchCatalogueVideo[] {
  const normalizedCurrentId = currentVideoId.trim();
  const candidates = allVideos.filter(
    (video) =>
      video._id &&
      video._id !== normalizedCurrentId &&
      isHomepageVisible(video)
  );

  if (!candidates.length) {
    return [];
  }

  const normalizedProjectId =
    typeof projectId === "string" ? projectId.trim() : "";

  const sameProject = normalizedProjectId
    ? candidates.filter(
        (video) => String(video.projectId) === normalizedProjectId
      )
    : [];

  const sameProjectIds = new Set(sameProject.map((video) => video._id));
  const randomPool = candidates.filter((video) => !sameProjectIds.has(video._id));
  const randomFill = shuffle(randomPool).slice(0, maxRandom);

  return [...sameProject, ...randomFill];
}
