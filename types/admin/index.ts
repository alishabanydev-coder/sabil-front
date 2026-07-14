export type {
  AdminUserRecord,
  AdminUserEditPanel,
  DonationProjectOption,
  DonationSource,
  UserDonationRecord,
} from "./users";

export type { SupporterRecord } from "./supporters";

export type { SocialMediaRecord } from "./socialMedia";

export type {
  CommentModalMode,
  CommentRecord,
  CommentThreadTarget,
  ThreadComment,
} from "./comments";

export type {
  AppManagementModalItem,
  AppManagementProjectPreviewData,
  AppManagementProjectRecord,
  AppManagementSection,
  AppManagementVideoRecord,
} from "./appManagement";

export type {
  AdminProjectCharacter,
  AdminProjectCharacterFormRecord,
  AdminProjectRecord,
} from "./projects";

export type {
  MainPageLayoutItem,
  MainPageLayoutSection,
} from "./mainPageLayout";

export { MAIN_PAGE_LAYOUT_SECTIONS } from "./mainPageLayout";

export type { AdminDonationProjectRecord } from "./donation";

export type {
  AdminChannelProjectRecord,
  AdminChannelVideoRecord,
} from "./channels";

export type { AdminCatalogueRecord } from "./catalogue";
export type { AdminBreakdownRecord } from "./breakdown";
export type { AdminBlogRecord } from "./blog";
export type { AdminBannerRecord } from "./banner";
export type { AdminAboutUsRecord } from "./aboutUs";
export type {
  AdminAccountRecord,
  AdminPermissionProjectRef,
  AdminPermissionTabKey,
} from "./admins";
export {
  ADMIN_PERMISSION_TAB_KEYS,
  ADMIN_PERMISSION_TAB_LABELS,
} from "./admins";

// Backward-compatible aliases used in existing admin code.
export type { AdminUserRecord as UserRecord } from "./users";
