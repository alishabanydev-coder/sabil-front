import TabsSection from "@/component/donation/TabsSection";
import TopSection from "@/component/donation/TopSection";
import { fetchPublicDonationProject } from "@/component/donation/services/donationPublicApi";
import { Stack } from "@mui/material";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

//base url
const SITE_URL = "https://sabeelkids.com";

type PageProps = {
  params: Promise<{ donationProjectId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { donationProjectId } = await params;
  const result = await fetchPublicDonationProject(donationProjectId);

  if (!result.ok || !result.donationProject) {
    return {
      title: "Donation Project Not Found | Sabeel Kids",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const project = result.donationProject;
  const title = `${project.title} | Sabeel Kids Donation`;
  const description =
    project.shortDescription?.trim() ||
    "Support this Sabeel Kids donation project and help bring meaningful Islamic children's content to life.";

  const url = `${SITE_URL}/donation/${project.slug || donationProjectId}`;
  const image =
    project.poster ||
    `${SITE_URL}/icon-192.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Sabeel Kids",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: image,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const DonationProjectPage = async ({ params }: PageProps) => {
  const { donationProjectId } = await params;
  const result = await fetchPublicDonationProject(donationProjectId);

  if (!result.ok || !result.donationProject) {
    notFound();
  }

  const projectData = result.donationProject;

  return (
    <Stack
      sx={{
        width: "100%",
        mx: "auto",
        direction: "ltr",
        gap: 3,
        pt: { xs: 8, sm: 10, md: 12 },
        pb: 10,
      }}
    >
      <TopSection projectData={projectData} />
      <Stack sx={{ width: "100%", bgcolor: "background.paper" }}>
        <TabsSection projectData={projectData} />
      </Stack>
    </Stack>
  );
};

export default DonationProjectPage;
