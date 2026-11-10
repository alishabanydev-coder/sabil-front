import type { Metadata } from "next";
import { fetchPublicAllVideos } from "@/component/admin/services/mainPageLayoutApi";
import {
  fetchPublicAppCatalogueFeaturedVideos,
  fetchPublicAppCatalogueHomeVideos,
  fetchPublicAppCatalogueNavigationButtons,
  fetchPublicAppCatalogueSuggestedVideos,
} from "@/component/admin/services/appManagementApi";
import AppIndex from "@/component/appCatalogue/AppIndex";
import { SITE_URL } from "@/lib/site";

type NavigationButton = {
  type?: string;
  title?: string;
};

async function loadChannelNames(): Promise<string[]> {
  try {
    const navigationButtonsRaw = await fetchPublicAppCatalogueNavigationButtons();
    const buttons = (
      Array.isArray(navigationButtonsRaw) ? navigationButtonsRaw : []
    ) as NavigationButton[];
    const seen = new Set<string>();
    const names: string[] = [];

    for (const item of buttons) {
      if (item?.type !== "project") continue;
      const title = typeof item.title === "string" ? item.title.trim() : "";
      if (!title || seen.has(title)) continue;
      seen.add(title);
      names.push(title);
    }

    return names;
  } catch {
    return [];
  }
}

function channelDescription(channelNames: string[]) {
  if (channelNames.length === 0) {
    return "Open the Sabeel Kids app to choose a channel and watch.";
  }

  const listed = channelNames.join(", ");
  const description = `Sabeel Kids channels: ${listed}. Open the app to choose a channel and watch.`;
  return description.length > 180 ? `${description.slice(0, 177)}...` : description;
}

export async function generateMetadata(): Promise<Metadata> {
  const channelNames = await loadChannelNames();
  const description = channelDescription(channelNames);

  return {
    title: "Sabeel Kids App",
    description,
    alternates: {
      canonical: "/app",
    },
    openGraph: {
      title: "Sabeel Kids App",
      description,
      url: "/app",
      siteName: "Sabeel Kids",
      locale: "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
  const channelNames: string[] = [];
  const seenChannelNames = new Set<string>();
  for (const item of navigationButtons as NavigationButton[]) {
    if (item?.type !== "project") continue;
    const title = typeof item.title === "string" ? item.title.trim() : "";
    if (!title || seenChannelNames.has(title)) continue;
    seenChannelNames.add(title);
    channelNames.push(title);
  }
  const channelList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sabeel Kids channels",
    itemListElement: channelNames.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      url: `${SITE_URL}/app`,
    })),
  };
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
    <>
      {channelNames.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(channelList) }}
        />
      )}
      <AppIndex
        navigationButtons={navigationButtons}
        homeVideos={homeVideos}
        suggestedVideos={suggestedVideos}
        featuredByProjectId={featuredByProjectId}
        allVideos={allVideos}
      />
    </>
  );
}
