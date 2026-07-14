export const ADMIN_PERMISSION_TAB_KEYS = [
  "mainPageLayout",
  "appManagement",
  "banner",
  "breakdowns",
  "blog",
  "comments",
  "channels",
  "users",
  "socialMedia",
  "aboutUs",
] as const;

export type AdminPermissionTabKey = (typeof ADMIN_PERMISSION_TAB_KEYS)[number];

export const ADMIN_PERMISSION_TAB_LABELS: Record<AdminPermissionTabKey, string> =
  {
    mainPageLayout: "Main Page Layout",
    appManagement: "App Management",
    banner: "Banner",
    breakdowns: "Breakdowns",
    blog: "Blog",
    comments: "Comments",
    channels: "Channels",
    users: "Users",
    socialMedia: "Social Media",
    aboutUs: "About Us",
  };

export type AdminPermissionProjectRef = {
  _id?: string;
  id?: string;
  name?: string;
};

export type AdminAccountRecord = {
  _id?: string;
  id?: string;
  userName?: string;
  name?: string;
  role?: string;
  permissions?: Array<{
    tab?: string;
    projectIds?: Array<string | AdminPermissionProjectRef>;
  }>;
};
