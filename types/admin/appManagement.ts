export type AppManagementSection = {
  name: "navBtn" | "homeVideo" | "suggestedVideo" | "featuredVideo";
  title: string;
  url: string;
};

export type AppManagementProjectRecord = {
  _id: string;
  name: string;
  thumbnail: string;
  featuredVideoIds?: string[];
};

export type AppManagementVideoRecord = {
  _id: string;
  title: string;
  thumbnail: string;
  projectId: string;
  isPublished?: boolean;
};

export type AppManagementProjectPreviewData = {
  _id?: string;
  id?: string;
  title: string;
  name?: string;
  image: string;
};

export type AppManagementModalItem = {
  id: string;
  title: string;
  image: string;
  projectId?: string;
  isPublished?: boolean;
};
