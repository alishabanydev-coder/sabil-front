import type { MetadataRoute } from "next";
import { fetchPublicAllVideos } from "@/component/appCatalogue/services/appCatalogueApi";
import { fetchPublicDonationProjects } from "@/component/donation/services/donationPublicApi";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/app`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/donation`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  try {
    const donationResult = await fetchPublicDonationProjects();
    if (donationResult.ok) {
      for (const project of donationResult.donationProjects) {
        const id =
          typeof project?.slug === "string" && project.slug.trim()
            ? project.slug.trim()
            : typeof project?._id === "string"
              ? project._id
              : "";
        if (!id) continue;
        pages.push({
          url: `${SITE_URL}/donation/${encodeURIComponent(id)}`,
          changeFrequency: "weekly",
          priority: 0.5,
        });
      }
    }
  } catch {
    // Static pages still ship if the donation API is unavailable at build time.
  }

  try {
    const videoResult = await fetchPublicAllVideos();
    if (videoResult.ok) {
      for (const video of videoResult.videos) {
        const id = typeof video?._id === "string" ? video._id.trim() : "";
        if (!id) continue;
        pages.push({
          url: `${SITE_URL}/app/watch/${encodeURIComponent(id)}`,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // The catalogue URL above is still listed if the video API is unavailable.
  }

  return pages;
}
