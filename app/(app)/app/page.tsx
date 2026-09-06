import AppCataloguePage from "@/component/appCatalogue/component/AppCataloguePage";
import Navbar from "@/component/appCatalogue/component/Navbar";
import { fetchPublicAllVideos } from "@/component/admin/services/mainPageLayoutApi";
import {
  fetchPublicAppCatalogueFeaturedVideos,
  fetchPublicAppCatalogueHomeVideos,
  fetchPublicAppCatalogueNavigationButtons,
  fetchPublicAppCatalogueSuggestedVideos,
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
  const [
    navigationButtonsRaw,
    homeVideosResult,
    suggestedVideosResult,
    featuredVideosResult,
    allVideosRaw,
  ] = await Promise.all([
    fetchPublicAppCatalogueNavigationButtons(),
    fetchPublicAppCatalogueHomeVideos(),
    fetchPublicAppCatalogueSuggestedVideos(),
    fetchPublicAppCatalogueFeaturedVideos(),
    fetchPublicAllVideos(),
  ]);

  const navigationButtons = Array.isArray(navigationButtonsRaw)
    ? navigationButtonsRaw
    : [];
  const homeVideos = (
    Array.isArray(homeVideosResult?.videos) ? homeVideosResult.videos : []
  ) as VideoData[];
  const suggestedVideos = (
    Array.isArray(suggestedVideosResult?.videos)
      ? suggestedVideosResult.videos
      : []
  ) as VideoData[];
  const featuredByProjectId = (featuredVideosResult?.featuredByProjectId ||
    {}) as Record<string, VideoData[]>;
  const allVideos = (
    Array.isArray(allVideosRaw) ? allVideosRaw : []
  ) as VideoData[];

  return (
    <AppIndex
      navigationButtons={navigationButtons}
      homeVideos={homeVideos}
      suggestedVideos={suggestedVideos}
      featuredByProjectId={featuredByProjectId}
      allVideos={allVideos}
    />
  );
}
