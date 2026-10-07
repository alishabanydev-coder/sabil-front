import DonationProjectBanner from "@/component/donation/DonationProjectBanner";
import TabsSection from "@/component/donation/TabsSection";
import TopSection from "@/component/donation/TopSection";
import { fetchPublicDonationProject } from "@/component/donation/services/donationPublicApi";
import { Button, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import Image from "next/image";
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
  const image = project.poster || `${SITE_URL}/icon-192.webp`;

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
        position: "relative",
        direction: "ltr",
        width: "100%",
        mx: "auto",
        gap: 3,
        pb: 10,
        pt: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Button
        href="/donation"
        variant="text"
        disableRipple
        sx={{
          position: "absolute",
          flexDirection: "row",
          top: { xs: 10, sm: 15, md: 20, lg: 25, xl: 28 },
          left: { xs: 7, sm: 15, md: 20, lg: 25, xl: 28 },
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 0.5, sm: 1 },
          cursor: "pointer",
          "& p": {
            fontSize: { xs: 10, sm: 16, md: 18, lg: 20, xl: 22 },
            fontFamily: "Namecat",
            lineHeight: 1,
            letterSpacing: 1,
            color: "#00C1F2",
          },
          "& img": {
            width: { xs: 12, sm: 18, md: 22, lg: 28, xl: 30 },
            height: { xs: 8, sm: 12, md: 14, lg: 19, xl: 21 },
            mb: 0.2,
          },
        }}
      >
        <Image
          src={"/back-arrow.png"}
          alt={"back to main page"}
          width={28}
          height={19}
        />
        <Typography>back to main page</Typography>
      </Button>
      <DonationProjectBanner projectData={projectData} />
      {/* <TopSection projectData={projectData} />
      <Stack sx={{ width: "100%", bgcolor: "background.paper" }}>
        <TabsSection projectData={projectData} />
      </Stack> */}
    </Stack>
  );
};

export default DonationProjectPage;
