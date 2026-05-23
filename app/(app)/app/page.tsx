import AppCataloguePage from "@/component/appCatalogue/AppCataloguePage";
import { fetchPublicMainPageLayoutItems } from "@/component/admin/services/mainPageLayoutApi";

type ProjectData = {
  _id: string;
  name: string;
  title: string;
  thumbnail: string;
  description: string;
};

type CatalogueData = {
  _id: string;
  projectId: string;
  header: string;
  body: string;
  image: string;
};

type VideoData = {
  _id: string;
  projectId: string;
  title: string;
  thumbnail: string;
  season?: number;
  episode?: number;
};

export default async function AppPage() {
  const [projectsRaw, cataloguesRaw, videosRaw] = await Promise.all([
    fetchPublicMainPageLayoutItems("projects"),
    fetchPublicMainPageLayoutItems("catalogues"),
    fetchPublicMainPageLayoutItems("video"),
  ]);

  const projects = (Array.isArray(projectsRaw) ? projectsRaw : []) as ProjectData[];
  const catalogues = (Array.isArray(cataloguesRaw)
    ? cataloguesRaw
    : []) as CatalogueData[];
  const videos = (Array.isArray(videosRaw) ? videosRaw : []) as VideoData[];

  return (
    <AppCataloguePage projects={projects} catalogues={catalogues} videos={videos} />
  );
}
