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
};
