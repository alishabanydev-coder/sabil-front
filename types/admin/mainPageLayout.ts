export type MainPageLayoutSection = {
  name: string;
  title: string;
  header: string;
  text: string;
};

export type MainPageLayoutItem = {
  _id: string;
  showInHomepage?: boolean;
  homepageOrder?: number | null;
  projectId?: string;
  text?: string;
  [key: string]: unknown;
};

export const MAIN_PAGE_LAYOUT_SECTIONS: MainPageLayoutSection[] = [
  { name: "banner", title: "Banner", header: "poster", text: "name" },
  {
    name: "projects",
    title: "Subscribtion",
    header: "thumbnail",
    text: "title",
  },
  {
    name: "catalogues",
    title: "Catalogues",
    header: "image",
    text: "header",
  },
  {
    name: "breakdown",
    title: "Project Breakdowns",
    header: "thumbnail",
    text: "title",
  },
  { name: "video", title: "Watch Us", header: "thumbnail", text: "title" },
  { name: "comment", title: "People Opinion", header: "", text: "username" },
  { name: "blog", title: "Blog", header: "images", text: "title" },
];
