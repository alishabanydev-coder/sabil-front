import AppCataloguePage from "@/component/appCatalogue/component/AppCataloguePage";
import Navbar from "@/component/appCatalogue/component/Navbar";
import { fetchPublicAllVideos } from "@/component/admin/services/mainPageLayoutApi";
import {
  fetchPublicAppCatalogueHomeVideos,
  fetchPublicAppCatalogueNavigationButtons,
} from "@/component/admin/services/appManagementApi";
import AppIndex from "@/component/appCatalogue/AppIndex";

type VideoData = {
  _id: string;
  projectId: string;
  title: string;
  thumbnail: string;
  season?: number;
  episode?: number;
};

export default async function AppPage() {
  const [navigationButtonsRaw, homeVideosResult, allVideosRaw] =
    await Promise.all([
      fetchPublicAppCatalogueNavigationButtons(),
      fetchPublicAppCatalogueHomeVideos(),
      fetchPublicAllVideos(),
    ]);

  const navigationButtons = Array.isArray(navigationButtonsRaw)
    ? navigationButtonsRaw
    : [];
  const homeVideos = (
    Array.isArray(homeVideosResult?.videos) ? homeVideosResult.videos : []
  ) as VideoData[];
  const allVideos = (
    Array.isArray(allVideosRaw) ? allVideosRaw : []
  ) as VideoData[];

  return (
    <AppIndex
      navigationButtons={navigationButtons}
      homeVideos={homeVideos}
      allVideos={allVideos}
    />
  );
}
