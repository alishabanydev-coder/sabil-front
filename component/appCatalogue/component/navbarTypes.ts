export type NavigationButtonData = {
  id: string;
  type: "home" | "project";
  title: string;
  image: string;
  projectId?: string;
};

export type VideoData = {
  _id: string;
  projectId: string;
  title: string;
  thumbnail: string;
  season?: number;
  episode?: number;
};

export type NavbarProps = {
  allVideos: VideoData[];
  navigationButtons: NavigationButtonData[];
  selectedNav: string;
  setSelectedNav: (nav: string) => void;
};
