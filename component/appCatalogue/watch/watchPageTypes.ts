import type { WatchCatalogueVideo } from "./buildWatchRelatedVideos";

export type VideoDetails = {
  title?: string;
  description?: string;
  url?: string;
  projectId?: string;
  episode?: number;
  season?: number;
  thumbnail?: string;
};

export type ProjectDetails = {
  _id?: string;
  title?: string;
  name?: string;
  thumbnail?: string;
  description?: string;
};

export type WatchPageViewModel = {
  video: VideoDetails | null;
  status: "loading" | "ready" | "error";
  errorMessage: string;
  relatedVideos: WatchCatalogueVideo[];
  relatedLoading: boolean;
  videoUrl: string;
  hasVideoUrl: boolean;
  videoThumbnail: string;
  projectName?: string;
  projectLogo?: string;
  playerStarted: boolean;
  nativeBelowShift: number;
  setPlayerStarted: (started: boolean) => void;
  setNativeBelowShift: (shiftY: number) => void;
};
