import type { WatchCatalogueVideo } from "./buildWatchRelatedVideos";

export type ProjectPreview = {
  name: string;
  logo: string;
};

export type ProjectPreviewMap = Record<string, ProjectPreview>;

export function enrichWatchRelatedVideos(
  videos: WatchCatalogueVideo[],
  projectPreviews: ProjectPreviewMap,
  currentProject?: {
    id?: string;
    logo?: string;
    name?: string;
  }
): WatchCatalogueVideo[] {
  const currentProjectId =
    typeof currentProject?.id === "string" ? currentProject.id.trim() : "";
  const currentProjectLogo =
    typeof currentProject?.logo === "string" ? currentProject.logo.trim() : "";
  const currentProjectName =
    typeof currentProject?.name === "string" ? currentProject.name.trim() : "";

  return videos.map((item) => {
    const preview = projectPreviews[String(item.projectId)];
    const isCurrentProject =
      currentProjectId && String(item.projectId) === currentProjectId;

    return {
      ...item,
      projectThumbnail:
        item.projectThumbnail?.trim() ||
        preview?.logo?.trim() ||
        (isCurrentProject ? currentProjectLogo : ""),
      projectTitle:
        item.projectTitle?.trim() ||
        preview?.name?.trim() ||
        (isCurrentProject ? currentProjectName : "Project"),
    };
  });
}
