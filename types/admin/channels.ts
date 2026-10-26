export type AdminChannelProjectRecord = {
  _id: string;
  id: string;
  name: string;
  thumbnail: string;
};

export type AdminChannelVideoRecord = {
  _id: string;
  id?: string;
  title: string;
  url: string;
  thumbnail: string;
  description: string;
  season: number;
  episode: number;
  isPublished?: boolean;
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  youtubeVideoId?: string;
  youtubeChannelId?: string;
};

export type ConnectedYouTubeChannelRecord = {
  _id: string;
  youtubeChannelId: string;
  channelTitle: string;
  channelThumbnail?: string;
  customUrl?: string;
  updatedAt?: string;
};

export type YouTubeVideoFetchedDetails = {
  youtubeVideoId: string;
  youtubeChannelId: string;
  youtubeChannelTitle: string;
  title: string;
  description: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailUrl?: string;
  publishedAt?: string | null;
  matchedOwnerChannel: boolean;
};

